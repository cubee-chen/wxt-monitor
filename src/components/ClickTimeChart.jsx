// src/components/ClickTimeChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const ClickTimeChart = ({ clickHistory }) => {
  if (!clickHistory || clickHistory.length === 0) {
    return <div className="no-data">No click history yet</div>;
  }

  // Format data for the chart
  const chartData = clickHistory.map(click => ({
    time: new Date(click.time),
    count: click.count,
    formattedTime: format(new Date(click.time), 'HH:mm:ss')
  }));

  // Custom tooltip
  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="custom-tooltip">
          <p className="timestamp">Time: {data.formattedTime}</p>
          <p className="value">Click #: {data.count}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="time" 
          tickFormatter={(tick) => format(new Date(tick), 'HH:mm:ss')}
          minTickGap={30}
        />
        <YAxis />
        <Tooltip content={renderCustomTooltip} />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#8884d8" 
          name="Click Count"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ClickTimeChart;