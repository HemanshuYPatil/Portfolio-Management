import { connectToDatabase } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const { id } = await request.json(); // Extract the project ID from the request body

  try {
    const { db } = await connectToDatabase(); // Connect to the MongoDB database

    // Attempt to delete the project with the provided ID
    const result = await db.collection("work").deleteOne({ _id: new ObjectId(id) });

    // If a project was successfully deleted, return a success message
    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Project deleted successfully!" }, { status: 200 });
    } else {
      // If no project was found, return a not found error
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
