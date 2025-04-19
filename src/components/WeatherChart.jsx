// src/components/WeatherChart.jsx
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Label,
    ComposedChart,
    Scatter,
  } from "recharts";
  import { format } from "date-fns";
  import { useEffect, useRef } from "react";
  
  // Custom renderer for wind direction arrows
  const WindDirectionArrow = ({ cx, cy, direction }) => {
    if (!cx || !cy || direction === undefined) return null;
    
    // Convert direction to radians (meteorological degrees -> math degrees)
    // Weather direction is where wind comes FROM, so we need to rotate 180 degrees
    const angle = ((direction + 180) % 360) * Math.PI / 180;
    
    // Calculate arrow endpoint
    const length = 20; // Arrow length
    const x2 = cx + length * Math.sin(angle);
    const y2 = cy - length * Math.cos(angle);
    
    // Arrow head
    const headLength = 8;
    const headAngle = 0.5; // Radians
    
    const x3 = x2 - headLength * Math.sin(angle - headAngle);
    const y3 = y2 + headLength * Math.cos(angle - headAngle);
    const x4 = x2 - headLength * Math.sin(angle + headAngle);
    const y4 = y2 + headLength * Math.cos(angle + headAngle);
    
    return (
      <g>
        <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#FF9800" strokeWidth={2} />
        <polygon points={`${x2},${y2} ${x3},${y3} ${x4},${y4}`} fill="#FF9800" />
      </g>
    );
  };
  
  const WeatherChart = ({
    data,
    dataKey,
    directionKey,
    color,
    unit = "",
    yAxisLabel,
    chartType = "line",
    type = "standard",
  }) => {
    const chartRef = useRef(null);
    const arrowsRef = useRef([]);
    
    useEffect(() => {
      if (type === "wind" && chartRef.current) {
        // Draw wind direction arrows after chart renders
        const renderArrows = () => {
          const chartContainer = chartRef.current;
          if (!chartContainer) return;
          
          // Clear previous arrows
          arrowsRef.current.forEach(arrow => {
            if (arrow && arrow.parentNode) {
              arrow.parentNode.removeChild(arrow);
            }
          });
          arrowsRef.current = [];
          
          // Find chart container and get dimensions
          const chartElement = chartContainer.querySelector('.recharts-surface');
          if (!chartElement) return;
          
          // Extract data and coordinates from chart
          const dataPoints = data.filter((_, i) => i % 5 === 0); // Show every 5th point to avoid crowding
          
          dataPoints.forEach(point => {
            const value = point[dataKey];
            const direction = point[directionKey];
            if (value === undefined || direction === undefined) return;
            
            // Create an arrow element
            const arrow = document.createElementNS("http://www.w3.org/2000/svg", "g");
            arrowsRef.current.push(arrow);
            chartElement.appendChild(arrow);
            
            // Draw the arrow (simplified version for this demo)
            // In a real implementation, we would calculate proper coordinates
          });
        };
        
        // Call after a short delay to ensure chart is rendered
        setTimeout(renderArrows, 500);
      }
    }, [data, dataKey, directionKey, type]);
  
    if (!data || data.length === 0) {
      return <div className="no-data">No data available</div>;
    }
  
    // Format timestamp for display
    const formatXAxis = (timestamp) => {
      if (!timestamp) return "";
      try {
        const date = new Date(timestamp);
        return format(date, "HH:mm MM/dd");
      } catch (e) {
        return timestamp;
      }
    };
  
    // Custom tooltip to show formatted data
    const renderCustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const dataItem = payload[0].payload;
        let valueDisplay = `${payload[0].value}${unit}`;
  
        // Add direction info for wind data
        if (type === "wind" && dataItem[directionKey]) {
          valueDisplay += ` | Direction: ${dataItem[directionKey]}°`;
        }
  
        return (
          <div className="custom-tooltip" style={{ 
            backgroundColor: 'white', 
            padding: '10px',
            border: '1px solid #ccc' 
          }}>
            <p>{formatXAxis(label)}</p>
            <p>{valueDisplay}</p>
          </div>
        );
      }
      return null;
    };
  
    // Calculate Y-axis domain to make chart more readable
    const calculateYDomain = () => {
      if (!data || data.length === 0) return [0, 1];
  
      const values = data
        .map((item) => item[dataKey])
        .filter((value) => value !== undefined && value !== null);
  
      if (values.length === 0) return [0, 1];
  
      const min = Math.min(...values);
      const max = Math.max(...values);
  
      // Better padding calculation based on the range
      const range = max - min;
      const padding = range > 0 ? range * 0.15 : 0.5;
  
      return [Math.max(0, min - padding), max + padding];
    };
  
    // Custom component to render direction arrows
    const renderWindDirectionArrows = (props) => {
      const { cx, cy, payload } = props;
      if (!cx || !cy || !payload) return null;
      
      return (
        <WindDirectionArrow
          cx={cx}
          cy={cy}
          direction={payload[directionKey]}
        />
      );
    };
  
    // Render appropriate chart based on type
    if (type === "wind") {
      // Enhanced wind chart with direction arrows
      return (
        <div ref={chartRef} style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="TIMESTAMP"
                tickFormatter={formatXAxis}
                minTickGap={30}
              />
              <YAxis
                yAxisId="left"
                domain={calculateYDomain()}
                label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 360]}
                label={{
                  value: "Direction (°)",
                  angle: 90,
                  position: "insideRight",
                }}
              />
              <Tooltip content={renderCustomTooltip} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                dot={false}
                name="Wind Speed"
              />
              <Scatter
                yAxisId="right"
                dataKey={directionKey}
                fill="#FF9800"
                shape={renderWindDirectionArrows}
                name="Wind Direction"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (chartType === "bar") {
      // Render a bar chart
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="TIMESTAMP"
              tickFormatter={formatXAxis}
              minTickGap={30}
            />
            <YAxis
              domain={calculateYDomain()}
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={renderCustomTooltip} />
            <Bar dataKey={dataKey} fill={color} name={yAxisLabel.split(" ")[0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      // Default line chart
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="TIMESTAMP"
              tickFormatter={formatXAxis}
              minTickGap={30}
            />
            <YAxis
              domain={calculateYDomain()}
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={renderCustomTooltip} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              dot={false}
              name={yAxisLabel.split(" ")[0]}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };
  
  export default WeatherChart;