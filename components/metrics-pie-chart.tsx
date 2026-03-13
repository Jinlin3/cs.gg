'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MetricsPieChartProps {
  metrics: {
    allGoalsMet: number;
    someGoalsMet: number;
    noGoalsMet: number;
  };
}

const COLORS = ['#60a5fa', '#86efac', '#f87171']; // blue-400, green-300, red-400

const MetricsPieChart = ({ metrics }: MetricsPieChartProps) => {
  const data = [
    { name: 'All Goals Met', value: metrics.allGoalsMet, color: COLORS[0] },
    { name: 'Some Goals Met', value: metrics.someGoalsMet, color: COLORS[1] },
    { name: 'No Goals Met', value: metrics.noGoalsMet, color: COLORS[2] },
  ].filter(item => item.value > 0); // Only show slices with data

  if (data.length === 0) {
    return <div className="text-sm text-gray-500">No data to display</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={60}
          fill="#8884d8"
          dataKey="value"
          label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MetricsPieChart;