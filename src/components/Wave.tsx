import React from 'react';

interface WaveProps {
  color: string;
}

const Wave: React.FC<WaveProps> = ({ color }) => {
  return (
    <div className="absolute top-0 left-0 right-0">
      <svg
        className="w-full h-16 lg:h-24"
        viewBox="0 0 1200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 0L50 15C100 30 200 60 300 75C400 90 500 90 600 82.5C700 75 800 60 900 52.5C1000 45 1100 45 1150 45L1200 45V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0V0Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default Wave;
