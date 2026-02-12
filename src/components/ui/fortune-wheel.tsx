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

    const baseRotation = 360 * 5;
    const segmentAngle = 360 / POSSIBLE_POINTS.length;
    const targetRotation = baseRotation + (randomIndex * segmentAngle) + (segmentAngle / 2);

    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(selectedPoints);
      onResult(selectedPoints);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="relative w-80 h-80">
        <svg 
          viewBox="0 0 400 400" 
          className="w-full h-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
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
            
            const isEven = index % 2 === 0;
            
            return (
              <g key={points}>
                <path
                  d={`M 200 200 L ${x1} ${y1} A 200 200 0 0 1 ${x2} ${y2} Z`}
                  fill={isEven ? '#8B5CF6' : '#A78BFA'}
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-bold text-2xl fill-white"
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold'
                  }}
                >
                  {points}
                </text>
              </g>
            );
          })}
          <circle cx="200" cy="200" r="195" fill="none" stroke="#8B5CF6" strokeWidth="10"/>
        </svg>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-red-500 z-10" />
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