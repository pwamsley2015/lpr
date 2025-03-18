import React, { useState } from 'react';

const CardPicker = ({ onCardSelect, selectedCards = [] }) => {
  const suits = ['♥', '♦', '♣', '♠'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  
  // Function to handle card selection
  const handleCardClick = (card) => {
    if (onCardSelect) {
      onCardSelect(card);
    }
  };
  
  // Function to check if a card is already selected
  const isSelected = (card) => {
    return selectedCards.some(
      selectedCard => selectedCard.rank === card.rank && selectedCard.suit === card.suit
    );
  };

  // Function to get card color based on suit
  const getCardColor = (suit) => {
    return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-gray-900';
  };

  return (
    <div className="w-full">
      {/* Rank headers */}
      <div className="flex">
        {ranks.map(rank => (
          <div key={rank} className="w-10 text-center font-semibold text-sm mb-1 flex-shrink-0">
            {rank}
          </div>
        ))}
      </div>
      
      {/* Card grid */}
      {suits.map(suit => (
        <div key={suit} className="flex mb-1">
          {ranks.map(rank => {
            const card = { rank, suit };
            const selected = isSelected(card);
            
            return (
              <button
                key={`${rank}${suit}`}
                onClick={() => handleCardClick(card)}
                className={`
                  w-10 h-12 rounded border mr-1 flex-shrink-0
                  ${selected ? 'bg-blue-500 text-white' : 'bg-white'}
                  ${selected ? '' : getCardColor(suit)}
                  hover:bg-gray-100 transition
                  flex items-center justify-center
                `}
                disabled={selected}
              >
                <div className="flex flex-col items-center">
                  <span>{rank}</span>
                  <span>{suit}</span>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CardPicker;