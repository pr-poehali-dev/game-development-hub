import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FortuneWheelProps {
  onResult: (points: number) => void;
}

const POSSIBLE_POINTS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

export default function FortuneWheel({ onResult }: FortuneWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    const randomIndex = Math.floor(Math.random() * POSSIBLE_POINTS.length);
    const selectedPoints = POSSIBLE_POINTS[randomIndex];

    const segmentAngle = 360 / POSSIBLE_POINTS.length;
    const baseRotation = 360 * 5;
    
    const targetSegmentCenter = randomIndex * segmentAngle + (segmentAngle / 2);
    const targetRotation = baseRotation - targetSegmentCenter;

    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(selectedPoints);
      onResult(selectedPoints);
    }, 3000);
  };

  const COLORS = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#A855F7'
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="relative w-80 h-80">
        <div className={`absolute inset-0 rounded-full ${!spinning && result !== null ? 'animate-pulse' : ''}`}>
          <svg 
            viewBox="0 0 400 400" 
            className="w-full h-full drop-shadow-2xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              filter: !spinning && result !== null ? 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.8))' : 'none',
            }}
          >
            <defs>
              <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            
            {POSSIBLE_POINTS.map((points, index) => {
              const segmentAngle = 360 / POSSIBLE_POINTS.length;
              const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
              const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
              const midAngle = (startAngle + endAngle) / 2;
              
              const x1 = 200 + 200 * Math.cos(startAngle);
              const y1 = 200 + 200 * Math.sin(startAngle);
              const x2 = 200 + 200 * Math.cos(endAngle);
              const y2 = 200 + 200 * Math.sin(endAngle);
              
              const textX = 200 + 130 * Math.cos(midAngle);
              const textY = 200 + 130 * Math.sin(midAngle);
              
              return (
                <g key={points}>
                  <path
                    d={`M 200 200 L ${x1} ${y1} A 200 200 0 0 1 ${x2} ${y2} Z`}
                    fill={COLORS[index]}
                    stroke="#fff"
                    strokeWidth="3"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-bold fill-white"
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    {points}
                  </text>
                </g>
              );
            })}
            
            <circle cx="200" cy="200" r="197" fill="none" stroke="#FBBF24" strokeWidth="6"/>
            <circle cx="200" cy="200" r="190" fill="url(#wheelGlow)" opacity="0.4"/>
            <circle cx="200" cy="200" r="30" fill="#FBBF24" stroke="#fff" strokeWidth="3"/>
          </svg>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-0 h-0 border-l-[24px] border-r-[24px] border-t-[48px] border-l-transparent border-r-transparent border-t-red-500 z-10 drop-shadow-lg" />
      </div>

      {result !== null && (
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-primary animate-bounce">
            {result} баллов!
          </div>
        </div>
      )}

      {!spinning && result === null && (
        <Button
          onClick={spinWheel}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-xl font-bold"
        >
          Крутить колесо
        </Button>
      )}

      {spinning && (
        <div className="text-lg text-muted-foreground animate-pulse">
          Крутим колесо...
        </div>
      )}
    </div>
  );
}