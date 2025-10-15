
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'horizontal-bar';
  data: any[];
  colors?: string[];
  config?: any;
}

export default function StatisticsCharts({ type, data, colors, config }: ChartProps) {
  const moodColors = ['#FF9149', '#60B5FF', '#FF6363', '#80D8C3', '#A19AD3'];
  
  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis 
            dataKey="date" 
            tickLine={false}
            tick={{ fontSize: 10 }}
            label={{ value: 'Date', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
          />
          <YAxis 
            tickLine={false}
            tick={{ fontSize: 10 }}
            domain={['dataMin - 0.5', 'dataMax + 0.5']}
            label={{ value: 'Température (°C)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
          />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#FF9149" 
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis 
            dataKey="cycle" 
            tickLine={false}
            tick={{ fontSize: 10 }}
            label={{ value: 'Cycle', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
          />
          <YAxis 
            tickLine={false}
            tick={{ fontSize: 10 }}
            label={{ value: 'Durée (jours)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
          />
          <Tooltip />
          <Bar dataKey="length" fill="#60B5FF" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="mood"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={moodColors[index % moodColors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend 
            verticalAlign="top" 
            wrapperStyle={{ fontSize: 11 }} 
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'horizontal-bar') {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="horizontal">
          <XAxis 
            type="number" 
            tickLine={false}
            tick={{ fontSize: 10 }}
            domain={[0, 10]}
          />
          <YAxis 
            type="category" 
            dataKey="type" 
            tickLine={false}
            tick={{ fontSize: 10 }}
            width={100}
          />
          <Tooltip />
          <Bar dataKey="average" fill="#FF6363" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return <div>Graphique non supporté</div>;
}
