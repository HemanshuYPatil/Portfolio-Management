import { connectToDatabase } from "@/lib/mongo";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Import ObjectId to handle MongoDB IDs

// Define the handler for PUT requests, always targeting a specific ID
export async function PUT(request: Request) {
  const specificId = "67267be2d646acd1a7f76bc4"; // The specific ID to update

  try {
    const { image } = await request.json(); // Extract the image URL from the request body

    // Validate the input image URL
    if (!image || typeof image !== "string") {
      return NextResponse.json({ message: "Invalid image URL provided." }, { status: 400 });
    }

    console.log("Received request to update image URL for ID:", specificId); // Log the ID

    const { db } = await connectToDatabase();

    // Update the document with the new image URL
    const result = await db.collection("work").updateOne(
      { _id: new ObjectId(specificId) }, // Target the specific document by its ID
      { $set: { image } } // Update the image field
    );

    if (result.modifiedCount === 0) {
      console.log("No item updated for ID:", specificId); // Log if no item updated
      return NextResponse.json({ message: `Item not found or no changes made for ID: ${specificId}` }, { status: 404 });
    }

    return NextResponse.json({ message: "Image URL updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT handler:", error); // Log the error
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
