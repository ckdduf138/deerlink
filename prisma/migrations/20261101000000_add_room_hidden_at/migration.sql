-- AlterTable
ALTER TABLE "Room" ADD COLUMN "hiddenAt" DATETIME;

-- CreateIndex
CREATE INDEX "Room_hiddenAt_idx" ON "Room"("hiddenAt");
