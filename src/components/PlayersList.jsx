// PlayersList.js
import React, {useState, useEffect} from 'react';
import PlayerRow from './PlayerRow';
import config from '../config.js';


function PlayersList({onShowGameByGame}) {
  const [players, setPlayers] = useState([]);
  const [expandedPlayerId, setExpandedPlayerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");
  const teamList = config.teamList;
  const apiKey = process.env.API_KEY;


  useEffect(() => {
    // First, fetch the token
    fetch('https://project.trumedianetworks.com/api/token', {
      method: 'GET',
      headers: {
        'apiKey': apiKey,
      },
    })
      .then(response => response.json())
      .then(data => {
        const token = data.token;
        setToken(token);

        fetch('https://project.trumedianetworks.com/api/mlb/players', {
          method: 'GET',
          headers: {
            'tempToken': token,
          },
        })
          .then(response => response.json())
          .then(data => {
            setPlayers(data);
          })
          .catch(error => console.error('Error fetching players:', error));
      })
      .catch(error => console.error('Error fetching token:', error));
  }, []);

  const toggleExpandPlayer = (playerId) => {
    setExpandedPlayerId(expandedPlayerId === playerId ? null : playerId);
  };

  // Filter players based on the search term
  const filteredPlayers = players.filter(player => {
    // Convert searchTerm to lowercase for case-insensitive comparison
    const searchTermLower = searchTerm.toLowerCase();

    // Check if player's full name or team name matches the search term partially
    const playerNameMatch = player.playerFullName.toLowerCase().includes(searchTermLower);
    const teamId = player.teamImage.split('/').pop().split('.')[0]; // Extract team ID from image URL
    const teamName = teamList[teamId]; // Get team name from teamList using team ID
    const teamNameMatch = teamName && teamName.toLowerCase().includes(searchTermLower);

    // Return true if either player name or team name partially matches the search term
    return playerNameMatch || teamNameMatch;
  });


  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search by name or team..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{margin: '20px 0', padding: '10px', width: 'calc(100% - 22px)'}}
      />
      <div className='player-list-wrapper'>
        {players!==null  && filteredPlayers.length > 0 ? (
          filteredPlayers.map(player => (
            <PlayerRow
              key={player.playerId}
              player={player}
              token={token}
              isExpanded={expandedPlayerId === player.playerId}
              toggleExpand={toggleExpandPlayer}
              onShowGameByGame={onShowGameByGame}
            />
          ))
        ) : (
          <p>No players found.</p>
        )}
      </div>
    </div>
  );
}

export default PlayersList;
