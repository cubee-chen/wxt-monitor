// src/components/BatteryStatus.jsx
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, ReferenceLine, Label
  } from 'recharts';
  import { format } from 'date-fns';
  
  const BatteryStatus = ({ data }) => {
    if (!data || data.length === 0) {
      return <div className="no-data">No battery data available</div>;
    }
  
    // Format timestamp for display
    const formatXAxis = (timestamp) => {
      if (!timestamp) return '';
      try {
        const date = new Date(timestamp);
        return format(date, 'HH:mm MM/dd');
      } catch (e) {
        return timestamp;
      }
    };
  
    // Define thresholds for battery levels
    const CRITICAL_LEVEL = 12.0;
    const WARNING_LEVEL = 12.5;
    
    // Check current battery level
    const latestReading = data[data.length - 1];
    const currentBatteryLevel = latestReading?.batt_volt_Min || 0;
    
    const getBatteryStatus = (level) => {
      if (level < CRITICAL_LEVEL) return 'critical';
      if (level < WARNING_LEVEL) return 'warning';
      return 'normal';
    };
    
    const batteryStatus = getBatteryStatus(currentBatteryLevel);
  
    // Custom tooltip to show battery info
    const renderCustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const dataItem = payload[0].payload;
        const value = payload[0].value;
        const status = getBatteryStatus(value);
        
        return (
          <div className="custom-tooltip">
            <p className="timestamp">{dataItem.TIMESTAMP}</p>
            <p className="value">Battery: {value.toFixed(2)}V</p>
            <p className={`status ${status}`}>
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
            </p>
          </div>
        );
      }
      return null;
    };
  
    return (
      <div className="battery-wrapper">
        <div className={`battery-indicator ${batteryStatus}`}>
          <div className="battery-level" style={{ width: `${Math.min(100, (currentBatteryLevel / 14) * 100)}%` }}></div>
          <div className="battery-value">{currentBatteryLevel.toFixed(2)}V</div>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="TIMESTAMP" 
              tickFormatter={formatXAxis}
              minTickGap={30}
            />
            <YAxis 
              domain={[
                Math.min(11.5, Math.floor(Math.min(...data.map(d => d.batt_volt_Min || Infinity)) * 10) / 10),
                Math.max(14, Math.ceil(Math.max(...data.map(d => d.batt_volt_Min || 0)) * 10) / 10)
              ]}
              label={{ value: "", angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={renderCustomTooltip} />
            <ReferenceLine y={CRITICAL_LEVEL} stroke="red" strokeDasharray="3 3">
              <Label value="Critical" position="insideBottomRight" fill="red" />
            </ReferenceLine>
            <ReferenceLine y={WARNING_LEVEL} stroke="orange" strokeDasharray="3 3">
              <Label value="Warning" position="insideTopRight" fill="orange" />
            </ReferenceLine>
            <Line 
              type="monotone" 
              dataKey="batt_volt_Min" 
              stroke="#8884d8" 
              name="Battery"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default BatteryStatus;