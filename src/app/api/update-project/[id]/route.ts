import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/mongo"; // Adjust this import based on your project structure

// Named export for the PUT method
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Extract ID from params

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ message: "Invalid ID format" }), { status: 400 });
  }

  const updatedPost = await req.json(); // Get the updated post data from the request body

  // Ensure the required structure is maintained
  if (!updatedPost || !updatedPost.title || !updatedPost.details || !updatedPost.date || !updatedPost.roles || !Array.isArray(updatedPost.roles) || !updatedPost.links || !Array.isArray(updatedPost.links)) {
    return new Response(JSON.stringify({ message: "Missing required fields or incorrect format" }), { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("work").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedPost } // Set the updated post data
    );

    if (result.modifiedCount === 1) {
      return new Response(JSON.stringify({ message: "Project updated successfully!" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "No changes made to the project." }), { status: 400 });
    }
  } catch (error) {
    console.error("Error updating post:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}

// Export named functions for other HTTP methods if needed, e.g.:
export async function GET(req: Request, { params }: { params: { id: string } }) {
  // Handle GET requests if necessary
}
