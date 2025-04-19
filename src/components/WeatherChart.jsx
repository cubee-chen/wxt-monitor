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
  LabelList,
} from "recharts";
import { format } from "date-fns";

const WindDirectionArrow = (props) => {
  const { cx, cy, angle } = props;
  const radians = ((angle - 90) * Math.PI) / 180; // Convert to radians and adjust
  const length = 15;
  const x2 = cx + length * Math.cos(radians);
  const y2 = cy + length * Math.sin(radians);

  return (
    <g>
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#FF9800" strokeWidth={2} />
      <polygon
        points={`${x2},${y2} ${cx - 3 * Math.sin(radians)},${
          cy + 3 * Math.cos(radians)
        } ${cx + 3 * Math.sin(radians)},${cy - 3 * Math.cos(radians)}`}
        fill="#FF9800"
      />
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

  // Render appropriate chart based on type
  if (type === "wind") {
    // Render a combined chart for wind data
    return (
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
            name="Wind Direction"
          />
        </ComposedChart>
      </ResponsiveContainer>
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
