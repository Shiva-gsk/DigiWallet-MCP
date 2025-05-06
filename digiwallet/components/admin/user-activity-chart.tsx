"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data for the chart
const data = [
  { day: "Tue", active: 132, new: 23 },
  { day: "Mon", active: 120, new: 15 },
  { day: "Wed", active: 101, new: 18 },
  { day: "Thu", active: 134, new: 24 },
  { day: "Fri", active: 190, new: 38 },
  { day: "Sat", active: 230, new: 43 },
  { day: "Sun", active: 210, new: 31 },
];

export function UserActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
        <CardDescription>
          Daily active users and new registrations
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="active" name="Active Users" fill="#3b82f6" />
              <Bar dataKey="new" name="New Users" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
