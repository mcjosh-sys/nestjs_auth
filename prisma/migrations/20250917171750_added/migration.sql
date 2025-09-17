-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "hashedAt" TEXT,
ADD COLUMN     "hashedRt" TEXT;

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");
