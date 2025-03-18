import React, { useState, useEffect } from 'react';
import CardPicker from './components/CardPicker';
import TableSetup from './components/TableSetup';
import ActionInput from './components/ActionInput';
import MetricsPanel from './components/MetricsPanel';
import BoardCards from './components/BoardCards';

function App() {
  // Display unit state ($ or bb)
  const [displayUnit, setDisplayUnit] = useState('$'); // '$' or 'bb'
  const [bigBlindSize, setBigBlindSize] = useState(10); // Default BB = $10
  
  // Game state
  const [potSize, setPotSize] = useState(0);
  const [players, setPlayers] = useState([]);
  const [currentStreet, setCurrentStreet] = useState('Preflop');
  const [lastAction, setLastAction] = useState(null);
  const [board, setBoard] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  
  // Function to toggle between $ and bb display
  const toggleDisplayUnit = () => {
    setDisplayUnit(prevUnit => prevUnit === '$' ? 'bb' : '$');
  };
  
  // Function to handle actions from the ActionInput component
  const handleAction = (action, street) => {
    setLastAction(action);
    setCurrentStreet(street);
  };
  
  // Function to handle card selection from CardPicker
  const handleCardSelect = (card) => {
    // If we already have this card, don't add it again
    if (selectedCards.some(c => c.rank === card.rank && c.suit === card.suit)) {
      return;
    }
    
    // Add the card to our selection
    setSelectedCards(prev => [...prev, card]);
    
    // If we're selecting cards for the board
    if (board.length < 5) {
      setBoard(prev => [...prev, card]);
    }
  };
  
  // Function to update players from the TableSetup component
  const handlePlayersUpdate = (updatedPlayers) => {
    setPlayers(updatedPlayers);
  };
  
  // Effect to update metrics when actions happen
  useEffect(() => {
    // This would contain more complex logic in a full implementation
    // For now, we'll just make sure our current street matches the board state
    
    if (board.length >= 3 && currentStreet === 'Preflop') {
      setCurrentStreet('Flop');
    } else if (board.length >= 4 && currentStreet === 'Flop') {
      setCurrentStreet('Turn');
    } else if (board.length >= 5 && currentStreet === 'Turn') {
      setCurrentStreet('River');
    }
  }, [board, currentStreet]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Poker Hand Replay</h1>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Hand Setup</h2>
          
          {/* Big Blind Size and Toggle */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center">
              <label htmlFor="bbSize" className="mr-2 font-medium">BB Size:</label>
              <input
                id="bbSize"
                type="number"
                min="1"
                value={bigBlindSize}
                onChange={(e) => setBigBlindSize(Number(e.target.value))}
                className="w-20 p-2 border border-gray-300 rounded"
              />
              <span className="ml-1">$</span>
            </div>
            
            <button
              onClick={toggleDisplayUnit}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
            >
              {displayUnit} / {displayUnit === '$' ? 'bb' : '$'}
            </button>
          </div>
          
          {/* Table Setup Component */}
          <TableSetup 
            displayUnit={displayUnit} 
            bigBlindSize={bigBlindSize}
            onPlayersUpdate={handlePlayersUpdate}
          />
        </div>
        
        {/* Main gameplay area: 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column (2/3 width) */}
          <div className="md:col-span-2 space-y-6">
            {/* Board Cards */}
            <BoardCards 
              board={board}
              currentStreet={currentStreet}
              onCardSelect={() => {/* Would open card picker for board */}}
            />
            
            {/* Action Input */}
            <ActionInput 
              displayUnit={displayUnit}
              bigBlindSize={bigBlindSize}
              potSize={potSize}
              activePlayers={players}
              onAction={handleAction}
              updatePotSize={setPotSize}
            />
            
            {/* Card Picker */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Card Selection</h2>
              <CardPicker 
                onCardSelect={handleCardSelect}
                selectedCards={selectedCards}
              />
            </div>
          </div>
          
          {/* Right column (1/3 width) */}
          <div>
            <MetricsPanel 
              displayUnit={displayUnit}
              bigBlindSize={bigBlindSize}
              potSize={potSize}
              activePlayers={players}
              lastAction={lastAction}
              currentStreet={currentStreet}
              board={board}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;