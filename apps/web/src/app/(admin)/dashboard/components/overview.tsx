/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function Overview() {
  const data = useMemo(
    () => [
      {
        name: "Jan",
        total: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        name: "Feb",
        total: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        name: "Mar",
        total: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        name: "Apr",
        total: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        name: "May",
        total: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        name: "Jun",
        total: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        name: "Jul",
        total: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        name: "Aug",
        total: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        name: "Sep",
        total: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        name: "Oct",
        total: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        name: "Nov",
        total: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        name: "Dec",
        total: Math.floor(Math.random() * 5000) + 1000,
      },
    ],
    [],
  );
  const error = console.error;
  console.error = (...args: any) => {
    if (/Extra attributes/.test(args[0])) return;
    error(...args);
  };
  return (
    <ResponsiveContainer height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />

        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
