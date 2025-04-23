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
  ComposedChart,
  Scatter,
} from "recharts";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

// Custom renderer for wind direction arrows
const WindDirectionArrow = ({ cx, cy, direction, windSpeed }) => {
  if (!cx || !cy || direction === undefined) return null;

  // Convert direction to radians (meteorological degrees -> math degrees)
  // Weather direction is where wind comes FROM, so we need to rotate 180 degrees
  const angle = (((direction + 180) % 360) * Math.PI) / 180;

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
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
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

  // Modify wind direction data to display arrows on a straight line
  const modifyWindData = () => {
    if (type !== "wind") return data;

    return data.map((item) => {
      // Create a copy of the item
      const newItem = { ...item };

      // Set a fixed y-value for the wind direction
      // Use a fixed position at 70% of the max wind speed
      const maxWindSpeed = calculateYDomain()[1];
      newItem.arrowY = maxWindSpeed * 0.7;

      return newItem;
    });
  };

  // Dynamically adjust arrow interval based on data length
  const getArrowInterval = (dataLength) => {
    if (dataLength <= 730) return 5;  // 24h
    if (dataLength <= 2200) return 15; // 3d
    if (dataLength <= 5200) return 35; // 1w
    return 140;                        // 1m
  };

  // Custom component to render direction arrows all on the same horizontal line
  const renderWindDirectionArrows = (props) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy || !payload) return null;

    // Use fixed y-position for all arrows (about 70% up the chart)
    const fixedY = cy; // recharts will position cy at the arrowY value we set

    return (
      <WindDirectionArrow
        cx={cx}
        cy={fixedY}
        direction={payload[directionKey]}
        windSpeed={payload[dataKey]}
      />
    );
  };

  // Render appropriate chart based on type
  if (type === "wind") {
    // Modified wind data with fixed position for arrows
    const modifiedData = modifyWindData();
    // const arrowInterval = 5; // draw one arrow every 5 points
    const arrowInterval = getArrowInterval(modifiedData.length); 
    const arrowData = modifiedData.filter((_, i) => i % arrowInterval === 0);

    

    // Enhanced wind chart with direction arrows on the same horizontal line
    return (
      <div ref={chartRef} style={{ width: "100%", height: "300px" }}>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={modifiedData}>
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
              hide={true} // Hide the second axis
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
              yAxisId="left" // Use the same axis for the scatter points
              data={arrowData}
              dataKey="arrowY" // Use our fixed Y position
              fill="#FF9800"
              shape={renderWindDirectionArrows}
              name="Wind Direction"
              legendType="none"
            />
            {/* Add a reference line where arrows will be placed */}
            <Line
              yAxisId="left"
              dataKey="arrowY"
              stroke="rgba(255, 152, 0, 0.2)"
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
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
