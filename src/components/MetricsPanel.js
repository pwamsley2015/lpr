import React from 'react';
import { formatValue } from '../utils/unitConversion';
import { calculatePotOdds, calculateMDF, getHandStrength } from '../utils/equityCalculator';

const MetricsPanel = ({ 
  displayUnit, 
  bigBlindSize, 
  potSize, 
  activePlayers = [],
  lastAction,
  currentStreet,
  board = []
}) => {
  // Calculate effective stack (smallest active stack)
  const calculateEffectiveStack = () => {
    if (!activePlayers || activePlayers.length === 0) return 0;
    
    // Filter out inactive players and get the minimum stack
    const activeStacks = activePlayers
      .filter(player => player.active)
      .map(player => player.stack);
    
    return activeStacks.length > 0 ? Math.min(...activeStacks) : 0;
  };
  
  // Calculate pot odds
  const getPotOdds = () => {
    if (!lastAction || !['Bet', 'Raise'].includes(lastAction.type) || lastAction.amount === 0) {
      return 'N/A';
    }
    
    const betSize = lastAction.amount;
    const odds = calculatePotOdds(betSize, potSize);
    
    return `${odds.toFixed(1)}%`;
  };
  
  // Calculate MDF (Minimum Defense Frequency)
  const getMDF = () => {
    if (!lastAction || !['Bet', 'Raise'].includes(lastAction.type) || lastAction.amount === 0) {
      return 'N/A';
    }
    
    const betSize = lastAction.amount;
    const mdf = calculateMDF(betSize, potSize);
    
    return `${mdf.toFixed(1)}%`;
  };
  
  // Get hand strength if available
  const getHandDesc = () => {
    // This would use the hole cards of the active player in a real implementation
    const mockHoleCards = [
      { rank: 'A', suit: '♥' },
      { rank: 'K', suit: '♥' }
    ];
    
    if (board.length >= 3) {
      return getHandStrength(mockHoleCards, board);
    }
    
    return 'N/A';
  };
  
  // Calculate all-in equity (simplified version)
  const getAllInEquity = () => {
    // Check if we have enough cards to calculate equity
    const hasAllInOrShowdown = lastAction && lastAction.type === 'All-in';
    const hasEnoughCards = board.length >= 3; // At least the flop
    
    if (!hasAllInOrShowdown || !hasEnoughCards) {
      return 'N/A';
    }
    
    // Placeholder equity calculation (would be replaced with actual calculations)
    return '50.0%';
  };
  
  const effectiveStack = calculateEffectiveStack();
  const potOdds = getPotOdds();
  const mdf = getMDF();
  const handStrength = getHandDesc();
  const equity = getAllInEquity();

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Poker Metrics</h2>
      
      <div className="space-y-3">
        {/* Pot Size */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Pot Size:</span>
          <span className="font-semibold">{formatValue(potSize, displayUnit, bigBlindSize)}</span>
        </div>
        
        {/* Effective Stack */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Effective Stack:</span>
          <span className="font-semibold">{formatValue(effectiveStack, displayUnit, bigBlindSize)}</span>
        </div>
        
        {/* Pot Odds */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Pot Odds:</span>
          <span className="font-semibold">{potOdds}</span>
        </div>
        
        {/* MDF */}
        <div className="flex justify-between items-center">
          <span className="font-medium">MDF:</span>
          <span className="font-semibold">{mdf}</span>
        </div>
        
        {/* Hand Strength */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Hand Strength:</span>
          <span className="font-semibold">{handStrength}</span>
        </div>
        
        {/* All-in Equity */}
        <div className="flex justify-between items-center">
          <span className="font-medium">All-in Equity:</span>
          <span className="font-semibold">{equity}</span>
        </div>
        
        {/* Current Street */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Current Street:</span>
          <span className="font-semibold">{currentStreet}</span>
        </div>
      </div>
      
      {/* Helper text */}
      <div className="mt-4 text-xs text-gray-500">
        <p>Pot Odds: Bet size ÷ (Pot + Bet) × 100%</p>
        <p>MDF: (1 - Bet size ÷ (Pot + Bet)) × 100%</p>
        <p>Equity calculations are approximate</p>
      </div>
    </div>
  );
};

export default MetricsPanel;