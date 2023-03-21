import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { v4 as uuid } from 'uuid';

export async function getUsersFromSession(sessionToken: string) {
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expires <= new Date()) {
    await prisma.session.deleteMany({
      where: { id: session.id },
    });
    return null;
  }
  if (!session.user.oauthToken || !session.user.oauthTokenSecret) {
    return null;
  }
  return session.user;
}

export async function generateSessionToken(userId: string) {
  const sessionToken = uuid();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 12);
  const session = await prisma.session.create({
    data: {
      sessionToken,
      expires,
      user: { connect: { id: userId } },
    },
  });
  return session;
}

export function deleteSession(sessionToken: string) {
  return prisma.session.deleteMany({
    where: { sessionToken },
  });
}

export async function toggleActive(userId: string, isActive: boolean) {
  await prisma.user.updateMany({
    where: { id: userId },
    data: { isActive },
  });
}

export async function deleteOAuthField(twitterId: string) {
  await prisma.user.updateMany({
    where: { twitterId },
    data: {
      oauthToken: null,
      oauthTokenSecret: null,
      isActive: false,
    },
  });
}

export async function upsertUser({
  twitterId,
  screenName,
  oauthToken,
  oauthTokenSecret,
}: {
  twitterId: string;
  screenName: string;
  oauthToken: string;
  oauthTokenSecret: string;
}) {
  const user = await prisma.user.upsert({
    where: { twitterId },
    update: {
      screenName,
      oauthToken,
      oauthTokenSecret,
    },
    create: {
      twitterId,
      screenName,
      oauthToken,
      oauthTokenSecret,
    },
  });
  return user;
}

export async function getActiveUserCount() {
  const count = await prisma.user.count({
    where: {
      isActive: true,
      oauthToken: { not: null },
      oauthTokenSecret: { not: null },
    },
  });
  return count;
}

export async function getActiveTokenMany() {
  return await prisma.user.findMany({
    where: {
      isActive: true,
      oauthToken: { not: null },
      oauthTokenSecret: { not: null },
    },
  });
}
