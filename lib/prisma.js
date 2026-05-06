import dns from 'node:dns';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

dns.setDefaultResultOrder('ipv4first');

const globalForPrisma = globalThis;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  const useSsl = process.env.DB_SSL === 'true' || (connectionString && connectionString.includes('supabase.co'));
  const pool = new Pool({ connectionString, ssl: useSsl ? { rejectUnauthorized: false } : false });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;