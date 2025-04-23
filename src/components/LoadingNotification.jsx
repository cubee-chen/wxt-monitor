import { useState, useEffect } from 'react';

const LoadingNotification = ({ timeRange }) => {
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getMessage = () => {
    if (timeRange === '1m') {
      return "Processing one month of data, this may take a few seconds...";
    }
    if (timeRange === '1w') {
      return "Processing one week of data...";
    }
    return "Loading data...";
  };

  return (
    <div className="loading-notification">
      <p>{getMessage()}</p>
      <p>Loading time: {loadingTime} seconds</p>
    </div>
  );
};

export default LoadingNotification;
