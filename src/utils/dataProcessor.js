// Clean humidity data
export const cleanHumidityData = (data) => {
  return data.map(item => {
    if (item.relhumidity_Avg > 100 || item.relhumidity_Avg < 0) {
      // Replace invalid values with null
      return { ...item, relhumidity_Avg: null };
    }
    return item;
  });
};

// Downsample data based on time range
export const downsampleData = (data, timeRange) => {
  if (!data || data.length === 0) return [];

  let samplingInterval;
  switch (timeRange) {
    case '3d':
      samplingInterval = 30; // Every 30 points (1 hour)
      break;
    case '1w':
      samplingInterval = 60; // Every 60 points (2 hours)
      break;
    case '1m':
      samplingInterval = 180; // Every 180 points (6 hours)
      break;
    default:
      return data;
  }

  return data.filter((_, index) => index % samplingInterval === 0);
};

// Process and memoize data for charts
export const processChartData = (rawData, timeRange, dataKey) => {
  // Clean humidity data first if it's humidity data
  const cleanedData = dataKey === 'relhumidity_Avg' 
    ? cleanHumidityData(rawData)
    : rawData;

  // Then downsample
  const downsampledData = downsampleData(cleanedData, timeRange);
  
  // Additional processing specific to data type
  if (dataKey === 'Rintensity_Tot') {
    // Only keep non-zero values for rain intensity
    return downsampledData.filter(item => item[dataKey] > 0);
  }
  
  return downsampledData;
};
