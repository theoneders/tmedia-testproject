import React, { useState } from 'react';
import PlayersList from './components/PlayersList';
import GameByGame from './components/GameByGame';
import './App.css';


function App() {
  const [view, setView] = useState('list');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayerData, setSelectedPlayerData] = useState(null);

  const showGameByGame = (player,playerData) => {
    setSelectedPlayer(player);
    setSelectedPlayerData(playerData);
    setView('gameByGame');
  };
  const goBackToList = () => {
    setView('list');
  };

  return (
    <div>
      <header>
        <img className='header-img' src='./TruMedia.png' />
      </header>
      <div className="container">
      {view === 'list' && <PlayersList onShowGameByGame={showGameByGame} />}
      {view === 'gameByGame' && <GameByGame player={selectedPlayer} playerData={selectedPlayerData} onBack={goBackToList} />}
      </div>
    </div>
  );
}

export default App;
