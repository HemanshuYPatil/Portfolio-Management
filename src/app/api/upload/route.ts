import type { NextApiRequest, NextApiResponse } from "next";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError } from "uploadthing/server";
import { connectToDatabase } from "@/lib/mongo";

const f = createUploadthing();

// Fake authentication function
const auth = (req: NextApiRequest, res: NextApiResponse) => ({ id: "fakeId" });

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req, res }) => {
      const user = await auth(req, res);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // Update the MongoDB with the new image URL
      const { db } = await connectToDatabase();
      await db.collection("img").updateOne(
        { userId: metadata.userId }, // Assuming you have a userId field to identify the document
        { $set: { image: file.url } } // Update the image field
      );

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
