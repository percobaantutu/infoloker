import React from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import moment from "moment";

import { formatRupiah } from "../../../utils/formatRupiah";

const ChartWidget = ({ title, type = "line", data, color = "#215E61", isCurrency = false }) => {

  const formattedData = data?.map(item => ({
    ...item,
    displayDate: moment(item.date).format("MMM D")
  })) || [];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-96 flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart data={formattedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8D5" />
              <XAxis dataKey="displayDate" stroke="#6B818C" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#6B818C" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => isCurrency ? `Rp ${formatRupiah(String(value))}` : value}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [isCurrency ? `Rp ${formatRupiah(String(value))}` : value, title]}
                labelStyle={{ color: '#6B818C' }}
              />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          ) : (
            <BarChart data={formattedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8D5" />
              <XAxis dataKey="displayDate" stroke="#6B818C" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6B818C" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [value, title]}
              />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartWidget;