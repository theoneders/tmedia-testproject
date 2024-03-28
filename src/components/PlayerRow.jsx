// PlayerRow.js
import React, { useState, useEffect } from 'react';
import PlayerStats from './PlayerStats';


function PlayerRow({player,token, onShowGameByGame, isExpanded, toggleExpand}) {
  const [playerData, setPlayerData] = useState(null);

  useEffect(() => {
    async function fetchPlayerDetails() {
      if (isExpanded && token) {
        console.log("calling api");
        try {
          const response = await fetch(`https://project.trumedianetworks.com/api/mlb/player/${player.playerId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'tempToken': token, // Use the provided token here
            },
          });
          if (!response.ok) throw new Error('Failed to fetch player details');
          const data = await response.json();
          setPlayerData(data);
        } catch (error) {
          console.error("Error fetching player details:", error);
        }
      }
    }

    fetchPlayerDetails();
  }, [isExpanded, token, player.playerId]);

  return (
    <div className="player-row" onClick={() => toggleExpand(player.playerId)} style={{ width: '100%', display: 'block' }}>
      <div className="player-summary" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={player.teamImage} alt={`${player.currentTeamName} logo`} style={{ width: '30px', marginRight: '10px' }} />
          <img src={player.playerImage} alt={player.playerFullName} style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '10px' }} />
          {player.playerFullName}
        </div>
      </div>
      {isExpanded && (
        <div className="player-details">
          {/* Details can be expanded here */}
          <PlayerStats playerData={playerData} />
          <button
            className="button"
            onClick={(e) => {
              e.preventDefault();
              onShowGameByGame(player, playerData);
            }}
          >
            Game Stats
          </button>
        </div>
      )}
    </div>
  );
}

export default PlayerRow;
