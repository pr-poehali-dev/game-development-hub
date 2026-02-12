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
        <div
          className="absolute inset-0 rounded-full border-8 border-primary shadow-2xl bg-white"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          {POSSIBLE_POINTS.map((points, index) => {
            const angle = (360 / POSSIBLE_POINTS.length) * index;
            const isEven = index % 2 === 0;
            return (
              <div
                key={points}
                className={`absolute inset-0 flex items-center justify-center ${
                  isEven ? 'text-primary' : 'text-primary/70'
                }`}
                style={{
                  transform: `rotate(${angle}deg)`,
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 18) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 18) * Math.PI / 180)}%, ${50 + 50 * Math.cos((angle + 18) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle + 18) * Math.PI / 180)}%)`,
                }}
              >
                <div
                  className="font-bold text-2xl"
                  style={{
                    transform: `rotate(-${angle}deg) translateY(-100px)`,
                  }}
                >
                  {points}
                </div>
              </div>
            );
          })}
        </div>

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
