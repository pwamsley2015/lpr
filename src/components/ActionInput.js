import React, { useState } from 'react';
import { formatValue } from '../utils/unitConversion';

const ActionInput = ({ 
  displayUnit, 
  bigBlindSize, 
  potSize, 
  activePlayers, 
  onAction,
  updatePotSize
}) => {
  const streets = ['Preflop', 'Flop', 'Turn', 'River'];
  const [currentStreet, setCurrentStreet] = useState(streets[0]);
  const [selectedAction, setSelectedAction] = useState('Check');
  const [betSize, setBetSize] = useState(0);
  const [actionLog, setActionLog] = useState({
    Preflop: [],
    Flop: [],
    Turn: [],
    River: []
  });
  
  // Available actions
  const actions = ['Fold', 'Check', 'Call', 'Bet', 'Raise', 'All-in'];
  
  // Function to handle action submission
  const handleActionSubmit = () => {
    // Create action object
    const action = {
      type: selectedAction,
      amount: ['Bet', 'Raise', 'Call', 'All-in'].includes(selectedAction) ? betSize : 0,
      player: 'Player 1', // This would be dynamic in a full implementation
      timestamp: new Date().toISOString()
    };
    
    // Update action log
    setActionLog(prev => ({
      ...prev,
      [currentStreet]: [...prev[currentStreet], action]
    }));
    
    // Update pot size for betting actions
    if (['Bet', 'Raise', 'Call', 'All-in'].includes(selectedAction)) {
      updatePotSize(potSize + betSize);
    }
    
    // Notify parent component
    if (onAction) {
      onAction(action, currentStreet);
    }
    
    // Reset bet size after action
    setBetSize(0);
    
    // Auto-advance to next street if all players have acted
    // This is simplified and would be more complex in a full implementation
    if (currentStreet !== 'River' && action.type === 'Check' && actionLog[currentStreet].length > 0) {
      const nextStreetIndex = streets.indexOf(currentStreet) + 1;
      if (nextStreetIndex < streets.length) {
        setCurrentStreet(streets[nextStreetIndex]);
      }
    }
  };
  
  // Function to handle street change
  const handleStreetChange = (street) => {
    setCurrentStreet(street);
  };
  
  // Function to display bet size based on the current unit
  const displayBetSize = () => {
    return formatValue(betSize, displayUnit, bigBlindSize);
  };
  
  // Get action logs for the current street
  const currentActionLogs = actionLog[currentStreet];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Action Input</h2>
      
      {/* Street Tabs */}
      <div className="flex border-b mb-4">
        {streets.map(street => (
          <button
            key={street}
            onClick={() => handleStreetChange(street)}
            className={`
              px-4 py-2 font-medium 
              ${currentStreet === street ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}
            `}
          >
            {street}
          </button>
        ))}
      </div>
      
      {/* Action Input Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          {actions.map(action => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
        
        {['Bet', 'Raise', 'Call', 'All-in'].includes(selectedAction) && (
          <div className="flex items-center">
            <input
              type="number"
              min="0"
              value={betSize}
              onChange={(e) => setBetSize(Number(e.target.value))}
              className="w-20 p-2 border border-gray-300 rounded mr-2"
            />
            <span>{displayUnit}</span>
          </div>
        )}
        
        <button
          onClick={handleActionSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Action
        </button>
      </div>
      
      {/* Action Log */}
      <div className="mt-4">
        <h3 className="font-medium text-gray-700 mb-2">Action Log ({currentStreet})</h3>
        {currentActionLogs.length === 0 ? (
          <p className="text-gray-500">No actions recorded for this street.</p>
        ) : (
          <ul className="space-y-1">
            {currentActionLogs.map((action, index) => (
              <li key={index} className="text-sm">
                {action.player} - {action.type} 
                {['Bet', 'Raise', 'Call', 'All-in'].includes(action.type) && (
                  <span> {formatValue(action.amount, displayUnit, bigBlindSize)}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ActionInput;