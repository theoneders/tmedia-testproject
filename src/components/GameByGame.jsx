import React, {useState} from 'react';
import config from '../config.js';


function GameByGame({playerData, player, onBack}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGames, setSelectedGames] = useState([]);
  const teamList = config.teamList;


  const renderTeamImages = (game) => {
    if (game.home) {
      return (
        <>
          <img src={game.teamImage} alt={game.currentTeamName}/>
          <span className='at-text'>@</span>
          <img src={game.oppImage} alt={game.opponent}/>
        </>
      );
    } else if (game.away) {
      return (
        <>
          <img src={game.oppImage} alt={game.opponent}/>
          <span className='at-text'>@</span>
          <img src={game.teamImage} alt={game.currentTeamName}/>
        </>
      );
    }
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US'); // Format as mm/dd/yyyy
  };

  const handleGameClick = (gameId) => {
    const index = selectedGames.indexOf(gameId);
    if (index === -1) {
      setSelectedGames([...selectedGames, gameId]);
    } else {
      setSelectedGames(selectedGames.filter(id => id !== gameId));
    }
  };
  const goBackToList = () => {
    onBack();
  };

  const clearSelection = () => {
    setSelectedGames([]);
  };

  const aggregateStats = selectedGames.reduce(
    (aggStats, selectedGameId) => {
      const selectedGame = playerData.find(game => game.gameId === selectedGameId);
      if (selectedGame) {
        aggStats.totalAB += selectedGame.AB;
        aggStats.totalH += selectedGame.H;
        aggStats.totalHR += selectedGame.HR;
        aggStats.totalBB += selectedGame.BB;
        aggStats.totalHBP += selectedGame.HBP;
        aggStats.totalSF += selectedGame.SF;
        aggStats.totalTB += selectedGame.TB;
        aggStats.totalRBI += selectedGame.RBI;
        aggStats.totalK += selectedGame.K;
      }
      return aggStats;
    },
    {
      totalAB: 0,
      totalH: 0,
      totalHR: 0,
      totalBB: 0,
      totalHBP: 0,
      totalSF: 0,
      totalTB: 0,
      totalRBI: 0,
      totalK: 0,
    }
  );

  const avg = aggregateStats.totalH / aggregateStats.totalAB;
  const obp =
    (aggregateStats.totalH + aggregateStats.totalBB + aggregateStats.totalHBP) /
    (aggregateStats.totalAB + aggregateStats.totalBB + aggregateStats.totalHBP + aggregateStats.totalSF);
  const slg = aggregateStats.totalTB / aggregateStats.totalAB;
  const ops = obp + slg;
  const filteredGames = playerData.filter((game) => {
    if (!searchTerm.trim()) return true;
    const searchTermLower = searchTerm.toLowerCase();

    if (!isNaN(searchTermLower)) {
      const searchMonth = parseInt(searchTermLower);
      const gameDate = new Date(game.date);
      const gameMonth = gameDate.getMonth() + 1; // Months are 0 indexed in JavaScript
      return gameMonth === searchMonth;
    }

    // Check if the search term matches a specific day (e.g., "MM/DD")
    if (/^\d{1,2}\/\d{1,2}$/.test(searchTermLower)) {
      const [searchMonth, searchDay] = searchTermLower.split('/');
      const gameDate = new Date(game.date);
      const gameMonth = gameDate.getMonth() + 1; // Months are 0 indexed in JavaScript
      const gameDay = gameDate.getDate();
      return parseInt(searchMonth) === gameMonth && parseInt(searchDay) === gameDay;
    }

    // Filter the teamList to get matching team IDs
    const matchingTeamIds = Object.entries(teamList)
      .filter(([teamId, teamName]) => teamName.toLowerCase().includes(searchTermLower))
      .map(([teamId]) => teamId);
    return matchingTeamIds.includes(game.opponentId.toString());
  });


  return (
    <div>
      <div className="player-summary-gbg fixed">
        <div className="player-info">
          <button className="back-button" onClick={goBackToList}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M20 11H7.414l4.293-4.293a1 1 0 0 0-1.414-1.414l-6 6a1 1 0 0 0 0 1.414l6 6a1 1 0 0 0 1.414-1.414L7.414 13H20a1 1 0 0 0 0-2z"/>
            </svg>
          </button>
          <img src={player.playerImage} alt={player.playerFullName}/>
          <span className="player-summary-gbg-name">{player.playerFullName}</span>
        </div>
        {selectedGames.length > 0 && (
          <div className='aggregate-stats'>
            <table className="aggregate-stats-table">
              <thead>
              <tr>
                <th>AB</th>
                <th>H</th>
                <th>HR</th>
                <th>BB</th>
                <th>HBP</th>
                <th>SF</th>
                <th>TB</th>
                <th>RBI</th>
                <th>K</th>
                <th>AVG</th>
                <th>OBP</th>
                <th>SLG</th>
                <th>OPS</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{aggregateStats.totalAB}</td>
                <td>{aggregateStats.totalH}</td>
                <td>{aggregateStats.totalHR}</td>
                <td>{aggregateStats.totalBB}</td>
                <td>{aggregateStats.totalHBP}</td>
                <td>{aggregateStats.totalSF}</td>
                <td>{aggregateStats.totalTB}</td>
                <td>{aggregateStats.totalRBI}</td>
                <td>{aggregateStats.totalK}</td>
                <td>{aggregateStats.totalAB !== 0 ? avg.toFixed(3) : '0.000'}</td>
                <td>{(aggregateStats.totalAB + aggregateStats.totalBB + aggregateStats.totalHBP + aggregateStats.totalSF) !== 0 ? obp.toFixed(3) : '0.000'}</td>
                <td>{aggregateStats.totalAB !== 0 ? slg.toFixed(3) : '0.000'}</td>
                <td>{(aggregateStats.totalAB + aggregateStats.totalBB + aggregateStats.totalHBP + aggregateStats.totalSF) !== 0 ? ops.toFixed(3) : '0.000'}</td>
              </tr>
              </tbody>
            </table>
            <a href="#" className="clear-link" onClick={clearSelection}>Clear Selection</a>
          </div>
        )}
      </div>

      <div className="game-wrapper">
        <div className="game-list-container">
          <div className="gbg-search">
            <input
              type="text"
              placeholder="Filter by Team or date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{margin: '20px 0', padding: '10px', width: 'calc(100% - 22px)'}}
            /></div>
          <ul className="game-list">
            {[...filteredGames].reverse().map((game, index) => {
              const isSelected = selectedGames.includes(game.gameId);
              const listItemClass = isSelected ? 'selected' : index % 2 === 0 ? 'even' : 'odd';
              return (
                <li key={index} className={listItemClass} onClick={() => handleGameClick(game.gameId)}>
                  <div className="game-info">
                    <div>{formatDate(game.date)}</div>
                    <div>({game.result})</div>
                    <div className="team-images">{renderTeamImages(game)}</div>
                  </div>
                  <div className="game-stats">
                    <table className='game-stats-table'>
                      <thead>
                      <tr>
                        <th>AB</th>
                        <th>H</th>
                        <th>HR</th>
                        <th>BB</th>
                        <th>HBP</th>
                        <th>SF</th>
                        <th>TB</th>
                        <th>RBI</th>
                        <th>K</th>
                        <th>AVG</th>
                        <th>OBP</th>
                        <th>SLG</th>
                        <th>OPS</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>{game.AB}</td>
                        <td>{game.H}</td>
                        <td>{game.HR}</td>
                        <td>{game.BB}</td>
                        <td>{game.HBP}</td>
                        <td>{game.SF}</td>
                        <td>{game.TB}</td>
                        <td>{game.RBI}</td>
                        <td>{game.K}</td>
                        <td>{game.AB !== 0 ? (game.H / game.AB).toFixed(3) : '0.000'}</td>
                        <td>{(game.AB + game.BB + game.HBP + game.SF) !== 0 ? ((game.H + game.BB + game.HBP) / (game.AB + game.BB + game.HBP + game.SF)).toFixed(3) : '0.000'}</td>
                        <td>{game.AB !== 0 ? (game.TB / game.AB).toFixed(3) : '0.000'}</td>
                        <td>{(game.AB + game.BB + game.HBP + game.SF) !== 0 ? (((game.H + game.BB + game.HBP) / (game.AB + game.BB + game.HBP + game.SF)) + (game.TB / game.AB)).toFixed(3) : '0.000'}</td>

                      </tr>
                      </tbody>
                    </table>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GameByGame;
