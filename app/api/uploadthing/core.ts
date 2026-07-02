import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
    attachmentUploader: f({
        blob: {
            maxFileSize: "16MB",
            maxFileCount: 5
        }
    })
        .middleware(async () => {
            const session = await getServerSession(authOptions);

            if (!session?.user?.email) {
                throw new UploadThingError("Unauthorized")
            }

            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email
                },
                select: {
                    id: true
                }
            })

            if (!user) {
                throw new UploadThingError("Unauthorized")
            }

            return {
                userId: user.id
            }
        })
        .onUploadComplete(({ metadata }) => {
            return {
                uploadedBy: metadata.userId
            }
        })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
