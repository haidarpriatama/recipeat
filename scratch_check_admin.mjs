import 'dotenv/config';
import prisma from './lib/prisma.js';

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      take: 10
    });
    console.log(JSON.stringify(users, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}
listUsers();
