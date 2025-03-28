import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface ConfettiProps {
  duration?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ duration = 3000 }) => {
  const { width, height } = useWindowSize();
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isActive) return null;

  return (
    <ReactConfetti
      width={width}
      height={height}
      numberOfPieces={200}
      recycle={false}
      colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD']}
    />
  );
};

export default Confetti; 