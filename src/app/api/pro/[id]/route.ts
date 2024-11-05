import { connectToDatabase } from "@/lib/mongo";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Import ObjectId to handle MongoDB IDs

// Define the handler for GET requests with an ID parameter
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("Received request for ID:", params.id); // Log the ID

    const { db } = await connectToDatabase();

    // Fetch the work item with additional fields like 'details', 'roles', and 'links'
    const workItem = await db.collection("work").findOne(
      { _id: new ObjectId(params.id) },
      {
        projection: {
          _id: 1,
          id: 1,
          title: 1,
          details: 1, // Include 'details' (description and summary)
          date: 1,
          roles: 1, // Include 'roles'
          links: 1  // Include 'links'
        }
      }
    );

    if (!workItem) {
      console.log("No item found for ID:", params.id); // Log if no item found
      return NextResponse.json({ message: `Item not found for ID: ${params.id}` }, { status: 404 });
    }

    return NextResponse.json(workItem, { status: 200 });
  } catch (error) {
    console.error("Error in GET handler:", error); // Log the error
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
