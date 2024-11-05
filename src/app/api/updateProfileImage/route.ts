import { connectToDatabase } from "@/lib/mongo";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  const specificId = "67267be2d646acd1a7f76bc4"; // Your specific ID

  try {
    const { imageUrl } = await request.json(); // Extract image URL from request body

    // Validate image URL
    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ message: "Invalid image URL." }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Update the image URL in MongoDB
    const result = await db.collection("img").updateOne(
      { _id: new ObjectId(specificId) },
      { $set: { image: imageUrl } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "No item updated." }, { status: 404 });
    }

    return NextResponse.json({ message: "Image URL updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
  }
}
