import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Timer, Gift, Music, PauseCircle, PlayCircle } from 'lucide-react';

const BRUSH_TIME = 120; // 2 דקות בשניות
const TEETH_COUNT = 20; // סך כל השיניים
const SECONDS_PER_TOOTH = BRUSH_TIME / TEETH_COUNT; // 6 שניות לכל שן
const GIFTS = ['🎁', '🎨', '🎮', '🎪', '🎭', '🎠', '🎪', '🦄', '🌈', '🎨'];

const TEETH_POSITIONS = [
  // שיניים עליונות
  {x: 50, y: 40}, {x: 100, y: 35}, {x: 150, y: 30}, {x: 200, y: 28}, {x: 250, y: 28},
  {x: 300, y: 28}, {x: 350, y: 30}, {x: 400, y: 35}, {x: 450, y: 40}, {x: 500, y: 45},
  // שיניים תחתונות
  {x: 50, y: 160}, {x: 100, y: 165}, {x: 150, y: 170}, {x: 200, y: 172}, {x: 250, y: 172},
  {x: 300, y: 172}, {x: 350, y: 170}, {x: 400, y: 165}, {x: 450, y: 160}, {x: 500, y: 155}
];

const ToothbrushTimer = () => {
  const [timeLeft, setTimeLeft] = useState(BRUSH_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [currentGift, setCurrentGift] = useState('');
  const [currentTooth, setCurrentTooth] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(time => {
          const newTime = time - 1;
          setCurrentTooth(Math.floor((BRUSH_TIME - newTime) / SECONDS_PER_TOOTH));
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      showGiftReward();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const MusicPlayer = () => (
    <div style={{ display: 'none' }}>
      <iframe
        src={`https://www.youtube.com/embed/n5illsgvqKA?autoplay=${isRunning ? 1 : 0}&loop=1`}
        allow="autoplay"
        title="background music"
      />
    </div>
  );

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(BRUSH_TIME);
    setShowReward(false);
    setCurrentTooth(0);
  };

  const showGiftReward = () => {
    const randomGift = GIFTS[Math.floor(Math.random() * GIFTS.length)];
    setCurrentGift(randomGift);
    setShowReward(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((BRUSH_TIME - timeLeft) / BRUSH_TIME) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 text-center">
      {isRunning && <MusicPlayer />}
      <div className="text-4xl mb-8">
        {showReward ? (
          <div className="animate-bounce text-6xl">{currentGift}</div>
        ) : (
          <div className="flex flex-col items-center">
            <Timer className="w-16 h-16 mb-4" />
            <div className="text-5xl font-bold">{formatTime(timeLeft)}</div>
          </div>
        )}
      </div>

      <div className="w-full h-4 bg-gray-200 rounded-full mb-6">
        <div 
          className="h-full bg-green-500 rounded-full transition-all duration-1000"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="relative mb-6">
        <svg viewBox="0 0 600 200" className="w-full">
          {/* שפתיים */}
          <path d="M50 100 Q 300 200 550 100" stroke="#ff9999" fill="none" strokeWidth="4"/>
          <path d="M50 100 Q 300 0 550 100" stroke="#ff9999" fill="none" strokeWidth="4"/>
          
          {/* שיניים עליונות */}
          {TEETH_POSITIONS.slice(0, 10).map((pos, i) => (
            <rect
              key={`upper-${i}`}
              x={pos.x - 20}
              y={pos.y}
              width="40"
              height="50"
              fill="white"
              stroke="#ddd"
              rx="5"
            />
          ))}
          
          {/* שיניים תחתונות */}
          {TEETH_POSITIONS.slice(10).map((pos, i) => (
            <rect
              key={`lower-${i}`}
              x={pos.x - 20}
              y={pos.y}
              width="40"
              height="50"
              fill="white"
              stroke="#ddd"
              rx="5"
            />
          ))}
          
          {/* סמן ורוד */}
          {isRunning && !showReward && currentTooth < TEETH_COUNT && (
            <circle
              cx={TEETH_POSITIONS[currentTooth].x}
              cy={TEETH_POSITIONS[currentTooth].y + 25}
              r="15"
              fill="pink"
              className="animate-pulse"
              opacity="0.6"
            />
          )}
        </svg>
      </div>

      <div className="flex justify-center gap-4">
        {!showReward && (
          <>
            {isRunning ? (
              <button 
                onClick={pauseTimer}
                className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full"
              >
                <PauseCircle className="w-8 h-8" />
              </button>
            ) : (
              <button 
                onClick={startTimer}
                className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-full"
              >
                <PlayCircle className="w-8 h-8" />
              </button>
            )}
          </>
        )}
        
        <button 
          onClick={resetTimer}
          className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
        >
          התחל מחדש
        </button>
      </div>

      {isRunning && (
        <div className="mt-4 flex items-center justify-center">
          <Music className="w-6 h-6 animate-pulse" />
        </div>
      )}
    </Card>
  );
};

export default ToothbrushTimer;
