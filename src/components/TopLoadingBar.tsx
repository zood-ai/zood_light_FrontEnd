import React, { useState, useEffect } from 'react';

interface LoadingBarProps {
  isLoading: boolean;
}

const TopLoadingBar: React.FC<LoadingBarProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let timeOut : NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + Math.random() * 10 : prev));
      }, 300);
    } else {
      setProgress(100);
      timeOut = setTimeout(() => setProgress(0), 500); 
    }

    return () => {
      clearInterval(timer);
      clearTimeout(timeOut);
    };
  }, [isLoading]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[10000]">
      <div
        className={`h-full bg-main transition-all duration-500 ${progress === 0 ? 'opacity-0' : 'opacity-100'}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default TopLoadingBar;
