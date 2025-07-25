import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
 
const f = createUploadthing();
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  thumbnailUploader: f({ 
    image: { 
        maxFileSize: "4MB", 
        maxFileCount: 1 
        } 
    })
        .middleware(async () => {
            const self = await getSelf();

            return { user: self }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db.stream.update({
                where: { 
                    userId: metadata.user.id,
                 },
                data: { 
                    thumbnailUrl: file.url,
                 },
            });

            return { fileUrl: file.url };
        })
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;