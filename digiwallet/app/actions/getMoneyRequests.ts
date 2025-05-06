"use server";
import { db } from "../../lib/db";

export const getMoneyRequests = async (email: string) => {
  try {
    const response = await db.user.findFirst({
      where: {
        email,
      },
      include: {
        sentRequests: {
          include: {
            receiver: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        receivedRequests: {
            include: {
                sender: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
        },
      },
    });
    // console.log(response);
    return response;
  } catch (e) {
    console.log(e);
  }
};


