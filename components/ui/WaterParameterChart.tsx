import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartDataPoint {
  name: string;
  sicaklik?: number;
  pH?: number;
  TDS?: number;
  NO3?: number;
}

interface WaterParameterChartProps {
  data: ChartDataPoint[];
  lines: { dataKey: keyof ChartDataPoint; stroke: string; name: string }[];
}

const WaterParameterChart: React.FC<WaterParameterChartProps> = ({ data, lines }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#233554" />
          <XAxis dataKey="name" stroke="#8892b0" tick={{ fontSize: 12 }} />
          <YAxis stroke="#8892b0" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#112240',
              borderColor: '#233554',
              color: '#ccd6f6',
            }}
          />
          <Legend wrapperStyle={{ color: '#8892b0' }} />
          {lines.map(line => (
             <Line key={line.dataKey} type="monotone" dataKey={line.dataKey} stroke={line.stroke} name={line.name} activeDot={{ r: 8 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaterParameterChart;
