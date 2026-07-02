ALTER TABLE "attachments" ADD COLUMN "upload_key" TEXT;

CREATE UNIQUE INDEX "attachments_upload_key_key" ON "attachments"("upload_key");
