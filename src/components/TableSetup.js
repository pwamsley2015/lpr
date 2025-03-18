import React, { useState, useEffect, useRef, useCallback } from 'react';
import { formatValue } from '../utils/unitConversion';

const TableSetup = ({ displayUnit, bigBlindSize, onPlayersUpdate }) => {
  // Initialize 9 empty seats
  const [players, setPlayers] = useState(Array(9).fill(null).map(() => ({
    active: false,
    stack: 0,
    cards: []
  })));
  
  const canvasRef = useRef(null);
  
  // When players change, notify parent component
  useEffect(() => {
    if (onPlayersUpdate) {
      onPlayersUpdate(players);
    }
  }, [players, onPlayersUpdate]);
  
  // Function to toggle a seat's active state
  const toggleSeat = (seatIndex) => {
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      newPlayers[seatIndex] = {
        ...newPlayers[seatIndex],
        active: !newPlayers[seatIndex].active
      };
      return newPlayers;
    });
  };
  
  // Function to update a player's stack
  const updateStack = (seatIndex, value) => {
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      newPlayers[seatIndex] = {
        ...newPlayers[seatIndex],
        stack: value
      };
      return newPlayers;
    });
  };

  // Seat positions for the canvas (in relative coordinates 0-1)
  const seatPositions = [
    { x: 0.5, y: 0.5 },    // Center (for display purposes)
    { x: 0.75, y: 0.15 },  // Top Right-Center (Seat 1)
    { x: 0.9, y: 0.35 },   // Top Right (Seat 2)
    { x: 0.9, y: 0.65 },   // Middle Right (Seat 3)
    { x: 0.75, y: 0.85 },  // Bottom Right (Seat 4)
    { x: 0.5, y: 0.85 },   // Bottom (Seat 5)
    { x: 0.25, y: 0.85 },  // Bottom Left (Seat 6)
    { x: 0.1, y: 0.65 },   // Middle Left (Seat 7)
    { x: 0.1, y: 0.35 },   // Top Left (Seat 8)
    { x: 0.25, y: 0.15 }   // Top Left-Center (Seat 9)
  ];

  // Function to render the table and players
  const renderTable = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw table (oval shape)
    ctx.fillStyle = '#047857'; // green-700 equivalent
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, width / 2 - 10, height / 2 - 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw table border
    ctx.strokeStyle = '#065f46'; // darker green for border
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Draw table center text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Poker Table', width * seatPositions[0].x, height * seatPositions[0].y);
    
    // Draw seats
    players.forEach((player, index) => {
      const pos = seatPositions[index + 1];
      const x = width * pos.x;
      const y = height * pos.y;
      
      // Adjust seat size based on canvas size
      const radius = Math.max(20, width * 0.03); 
      
      // Draw seat circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = player.active ? '#3b82f6' : '#9ca3af'; // blue-500 or gray-400
      ctx.fill();
      
      // Add hover effect
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw seat text
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.max(12, width * 0.015)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(player.active ? `Seat ${index + 1}` : 'Empty', x, y);
    });
  }, [players, seatPositions]);

  // Handle canvas sizing and initial rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Setup canvas to be responsive
    function resizeCanvas() {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      
      // Only update if canvas display size has changed
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        // Maintain aspect ratio
        const aspectRatio = 800 / 400;
        canvas.width = displayWidth;
        canvas.height = displayWidth / aspectRatio;
      }
      
      // Call render function
      renderTable();
    }

    // Call once on initial render
    resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [renderTable]);

  // Re-render when players change
  useEffect(() => {
    renderTable();
  }, [players, renderTable]);
  
  // Handle canvas click to toggle seats
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    // Calculate the scaling factor between the canvas's display size and its internal size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Get click position in canvas coordinates
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;
    
    // Convert to relative coordinates (0-1)
    const x = canvasX / canvas.width;
    const y = canvasY / canvas.height;
    
    console.log("Click at relative coordinates:", x, y);
    
    // Check if click is on any seat
    for (let i = 0; i < 9; i++) {
      const pos = seatPositions[i + 1];
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      
      console.log(`Seat ${i+1} distance:`, distance);
      
      // If click is within seat circle (increased radius for better usability)
      if (distance < 0.08) {
        console.log(`Toggling seat ${i+1}`);
        toggleSeat(i);
        return;
      }
    }
  };

  return (
    <div className="relative w-full">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        onClick={handleCanvasClick}
        className="w-full h-auto cursor-pointer border border-gray-400"
        style={{ maxWidth: '100%' }}
      />
      
      {/* Player stack inputs */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {players.map((player, index) => (
          player.active && (
            <div key={index} className="bg-white p-2 rounded shadow">
              <div className="text-center font-semibold">Seat {index + 1}</div>
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  value={player.stack}
                  onChange={(e) => updateStack(index, Number(e.target.value))}
                  className="w-20 p-1 border border-gray-300 rounded"
                />
                <span className="ml-1">{displayUnit}</span>
              </div>
              <div className="text-center text-sm mt-1">
                {formatValue(player.stack, displayUnit, bigBlindSize)}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default TableSetup;