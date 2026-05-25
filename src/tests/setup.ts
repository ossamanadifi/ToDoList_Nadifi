import { ChildProcess, execSync } from "child_process";
import { prisma } from "../db/db.ts";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export async function startDB(){
    //execSync('npx prisma db push --force-reset')
}

export async function dropTasks(){
    await prisma.task.deleteMany();
}


export async function disconnectDB(){
    await prisma.$disconnect();
}


export const generateTokenTest = (userId : string) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};