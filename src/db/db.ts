// src/db/db.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client/client.ts";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export { prisma };


export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('DB connesso');
    } catch (error) {
        console.error('DB non connesso', error);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    await prisma.$disconnect();
};