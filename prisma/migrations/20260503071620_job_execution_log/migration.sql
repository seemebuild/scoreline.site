-- CreateTable
CREATE TABLE "JobExecutionLog" (
    "id" TEXT NOT NULL,
    "jobId" TEXT,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "attempts" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobExecutionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobExecutionLog_jobId_createdAt_idx" ON "JobExecutionLog"("jobId", "createdAt");

-- CreateIndex
CREATE INDEX "JobExecutionLog_jobType_createdAt_idx" ON "JobExecutionLog"("jobType", "createdAt");

-- CreateIndex
CREATE INDEX "JobExecutionLog_status_createdAt_idx" ON "JobExecutionLog"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "JobExecutionLog" ADD CONSTRAINT "JobExecutionLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
