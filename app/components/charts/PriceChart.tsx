"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PriceChart({ products }: { products: any[] }) {
  const data = products.map((p) => ({
    name: p.name,
    price: p.price,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Product Price Distribution</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="finalPrice" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
