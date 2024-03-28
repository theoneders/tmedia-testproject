import React, {useState, useEffect} from 'react';

function PlayerStats({playerData}) {
  const [aggregateStats, setAggregateStats] = useState({
    totalAB: 0,
    totalHits: 0,
    totalHR: 0,
    totalBB: 0,
    totalHBP: 0,
    totalSF: 0,
    totalTB: 0,
    totalRBI: 0,
    totalK: 0,
  });

  useEffect(() => {
    const calculateAggregateStats = () => {
      let totalAB = 0,
        totalHits = 0,
        totalHR = 0,
        totalBB = 0,
        totalHBP = 0,
        totalSF = 0,
        totalTB = 0,
        totalRBI = 0,
        totalK = 0,
        numGames=0;

      if (playerData) {
        playerData.forEach(game => {
          totalAB += game.AB;
          totalHits += game.H;
          totalHR += game.HR;
          totalBB += game.BB;
          totalHBP += game.HBP;
          totalSF += game.SF;
          totalTB += game.TB;
          totalRBI += game.RBI;
          totalK += game.K;
        });
        numGames=playerData.length;

        setAggregateStats({
          totalAB,
          totalHits,
          totalHR,
          totalBB,
          totalHBP,
          totalSF,
          totalTB,
          totalRBI,
          totalK,
          numGames,
        });
      }
    }

    calculateAggregateStats();
  }, [playerData]);

  const {
    totalAB,
    totalHits,
    totalHR,
    totalBB,
    totalHBP,
    totalSF,
    totalTB,
    totalRBI,
    totalK,
    numGames,

  } = aggregateStats;

  // Calculate derived stats
  const avg = totalHits / totalAB || 0;
  const obp = (totalHits + totalBB + totalHBP) / (totalAB + totalBB + totalHBP + totalSF) || 0;
  const slg = totalTB / totalAB || 0;
  const ops = obp + slg;

  // Render the component
  return (
    <div>
      <table className='player-stats-table'>
        <thead>
        <tr>
          <th>G</th>
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
          <td>{numGames}</td>
          <td>{totalAB}</td>
          <td>{totalHits}</td>
          <td>{totalHR}</td>
          <td>{totalBB}</td>
          <td>{totalHBP}</td>
          <td>{totalSF}</td>
          <td>{totalTB}</td>
          <td>{totalRBI}</td>
          <td>{totalK}</td>
          <td>{numGames !== 0 ? avg.toFixed(3) : '0.000'}</td>
          <td>{(totalAB + totalBB + totalHBP + totalSF) !== 0 ? obp.toFixed(3) : '0.000'}</td>
          <td>{totalAB !== 0 ? slg.toFixed(3) : '0.000'}</td>
          <td>{(totalAB + totalBB + totalHBP + totalSF) !== 0 ? ops.toFixed(3) : '0.000'}</td>

        </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PlayerStats;
