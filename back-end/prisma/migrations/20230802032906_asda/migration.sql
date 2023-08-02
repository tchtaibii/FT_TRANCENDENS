-- AlterEnum
ALTER TYPE "notificationType" ADD VALUE 'Message';

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "unmuteUntil" TIMESTAMP(3),
ALTER COLUMN "Role" SET DEFAULT 'Member';
