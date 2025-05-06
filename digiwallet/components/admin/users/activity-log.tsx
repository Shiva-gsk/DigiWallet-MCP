"use client";

import { useEffect, useState, useTransition } from "react";
import { Clock, CreditCard, LogIn, LogOut, RefreshCw, Settings, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useUser } from "@clerk/nextjs";
// import { start } from "repl";
import { fetchActivities } from "@/app/actions/getActivities";
import LoadingWidget from "../../LoadingWidget";
// import { format } from "date-fns";  // For date formatting

interface ActivityLogProps {
  userId: string;
}

interface Activity {
  userId: string;
  id: string;
  activity_type: string;
  details: string | null;
  timestamp: Date;
}

export function ActivityLog({ userId }: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const {user} = useUser();
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    startTransition(() => {
      fetchActivities(userId).then((data) => {
        if (data) {
          setActivities(data);
          // setLoading(false);
          console.log(userId);
        } else {
          setError("Failed to fetch activities");
          // setLoading(false);
        }
    });
  });

    
  }, [userId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4" />;
      case "logout":
        return <LogOut className="h-4 w-4" />;
      case "transaction":
        return <RefreshCw className="h-4 w-4" />;
      case "settings":
        return <Settings className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isPending) return <LoadingWidget/>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-muted p-2">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    <div>
                      <div className="font-medium">{activity.details || "No details"}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {activity.activity_type}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {activity.timestamp.toDateString()} 
                    <div className="text-sm text-muted-foreground">
                      {activity.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
