import prisma from "@/utils/prisma";

export async function getUserFromDb(email: string) {
  return prisma.user.findUnique({
    where: {
      email
    }
  })
}