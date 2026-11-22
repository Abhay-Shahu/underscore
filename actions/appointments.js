"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { StreamClient } from "@stream-io/node-sdk";

export const getIntervieweeAppointments = async () => {
  const user = await currentUser();
  if (!user) return [];

  const dbUser = await db.user.findUnique({ where: { clerkUserId: user.id } });
  if (!dbUser) return [];

  const bookings = await db.booking.findMany({
    where: { intervieweeId: dbUser.id },
    include: {
      interviewer: {
        select: {
          name: true,
          imageUrl: true,
          email: true,
          title: true,
          company: true,
          categories: true,
        },
      },
      feedback: true,
    },
    orderBy: { startTime: "desc" },
  });

  // Auto-sync any recordings from Stream that aren't yet in DB
  try {
    if (
      process.env.NEXT_PUBLIC_STREAM_API_KEY &&
      process.env.STREAM_SECRET_KEY
    ) {
      const streamClient = new StreamClient(
        process.env.NEXT_PUBLIC_STREAM_API_KEY,
        process.env.STREAM_SECRET_KEY
      );

      await Promise.all(
        bookings.map(async (b) => {
          if (!b.recordingUrl && b.streamCallId) {
            try {
              const call = streamClient.video.call("default", b.streamCallId);
              const recs = await call.listRecordings();
              if (recs.recordings && recs.recordings.length > 0) {
                const latest = recs.recordings[recs.recordings.length - 1];
                b.recordingUrl = latest.url;
                await db.booking.update({
                  where: { id: b.id },
                  data: { recordingUrl: latest.url },
                });
              }
            } catch {}
          }
        })
      );
    }
  } catch {}

  return bookings;
};

