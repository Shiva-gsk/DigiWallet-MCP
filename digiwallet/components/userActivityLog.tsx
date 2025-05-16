
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card_ui";
import { 
  Activity, 
  SendHorizonal, 
  FileText, 
  Wallet, 
  RefreshCw,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { getUserActivityLogs } from "@/app/actions/getUserActivityogs";
import { ActivityLog } from "@/types";

interface ActivityLogModalProps {
  children: React.ReactNode;
}

const ActivityLogModal: React.FC<ActivityLogModalProps> = ({ children }) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();



  useEffect(() => {
    const fetchActivityLogs = async () => {
    if (user) {
      setIsLoading(true);
      const logs = await getUserActivityLogs(user.emailAddresses[0].emailAddress);
      if (logs) {
        setActivityLogs(logs);
      }
      setIsLoading(false);
    }
  };
    fetchActivityLogs();
  }, [user]);

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case "SEND_MONEY":
        return <SendHorizonal className="h-5 w-5 text-blue-600" />;
      case "REQUEST_MONEY":
        return <FileText className="h-5 w-5 text-red-400" />;
      case "WALLET_UPDATE":
        return <Wallet className="h-5 w-5 text-yellow-300" />;
      case "LOGIN":
        return <Activity className="h-5 w-5 text-green-600" />;
      case "SYSTEM_UPDATE":
        return <RefreshCw className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 text-purple-500" />
            Activity Log
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin" size={48} color="#4F46E5" />
          </div>
        ) : activityLogs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No activity logs found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activityLogs.map((log) => (
              <Card key={log.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full p-2 bg-gray-100">
                      {getActivityIcon(log.activity_type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{log.details}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-muted-foreground">
                          {log.timestamp.toLocaleString()}
                        </p>
                        
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ActivityLogModal;