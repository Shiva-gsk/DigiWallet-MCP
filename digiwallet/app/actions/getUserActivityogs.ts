"use server";

import { db } from "@/lib/db";
import { ActivityLog } from "@/types";

export async function getUserActivityLogs(email: string): Promise<ActivityLog[] | null> {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const activityLogs = await db.activityLog.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        timestamp: "desc",
      },
    });
    // console.log(activityLogs)
    return activityLogs as ActivityLog[];
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return null;
  }
}