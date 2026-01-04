"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StockChart({ products }: { products: any[] }) {
  const data = products.map((p) => ({
    name: p.name,
    stock: p.stock ?? 0,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Stock Levels</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="stock" stroke="#16a34a" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
