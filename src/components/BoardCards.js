import React from 'react';

const BoardCards = ({ 
  board, 
  currentStreet, 
  onCardSelect 
}) => {
  // Define how many cards should be shown based on street
  const getCardsToShow = () => {
    switch (currentStreet) {
      case 'Flop':
        return 3;
      case 'Turn':
        return 4;
      case 'River':
        return 5;
      default: // Preflop
        return 0;
    }
  };
  
  // Function to get card color based on suit
  const getCardColor = (suit) => {
    return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-gray-900';
  };
  
  const cardsToShow = getCardsToShow();
  const displayedCards = board.slice(0, cardsToShow);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Board Cards</h2>
      
      {currentStreet === 'Preflop' ? (
        <div className="flex items-center justify-center h-20 bg-gray-100 rounded-md">
          <p className="text-gray-500">No cards on board yet</p>
        </div>
      ) : (
        <div className="flex space-x-2 justify-center">
          {displayedCards.map((card, index) => (
            <div 
              key={index} 
              className={`
                w-16 h-24 rounded border border-gray-300 
                flex items-center justify-center font-semibold text-xl
                ${getCardColor(card.suit)}
              `}
            >
              <div className="flex flex-col items-center">
                <span>{card.rank}</span>
                <span>{card.suit}</span>
              </div>
            </div>
          ))}
          
          {/* Placeholder cards */}
          {Array.from({ length: 5 - displayedCards.length }).map((_, index) => (
            <div 
              key={`placeholder-${index}`}
              className="w-16 h-24 rounded border border-gray-300 bg-gray-100 flex items-center justify-center"
              onClick={() => onCardSelect && onCardSelect(displayedCards.length)}
            >
              <span className="text-gray-400">+</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardCards;