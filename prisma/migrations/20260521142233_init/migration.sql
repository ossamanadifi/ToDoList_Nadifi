/*
  Warnings:

  - The `state` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('COMPLETED', 'PLANNED');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "state",
ADD COLUMN     "state" "TaskStatus" NOT NULL DEFAULT 'PLANNED';
