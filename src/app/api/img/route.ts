import { connectToDatabase } from "@/lib/mongo";
import { NextResponse } from "next/server";

// Define the handler for GET requests
export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Fetch documents from the 'work' collection, retrieving only id and title
    const img = await db
      .collection("img")
      .find({}, { projection: { _id: 1, image: 1} })
      .toArray();

    // Return the result in a NextResponse object
    return NextResponse.json(img, { status: 200 });
  } catch (error) {
    console.error("Error fetching work data:", error);
    // Return a 500 response on error
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
