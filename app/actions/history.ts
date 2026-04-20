"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getHistory(params?: { query?: string; page?: number; limit?: number }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const query = params?.query || "";
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const skip = (page - 1) * limit;

  const where = {
    userId: session.user.id,
    OR: [
      { topic: { contains: query, mode: ("insensitive" as any) } },
      { videoType: { contains: query, mode: ("insensitive" as any) } },
    ],
  };

  const [history, total] = await Promise.all([
    prisma.generation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.generation.count({ where }),
  ]);

  return {
    items: history,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function deleteHistoryItem(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.generation.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/history");
}
