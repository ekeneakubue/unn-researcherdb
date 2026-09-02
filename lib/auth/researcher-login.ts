import "server-only";

import { prisma } from "@/lib/prisma";

export async function findResearcherForLogin(email: string) {
  return prisma.researcher.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: {
      id: true,
      reference: true,
      name: true,
      email: true,
      faculty: true,
      passwordHash: true,
      status: true,
    },
  });
}
