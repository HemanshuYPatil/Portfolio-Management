import { connectToDatabase } from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("unactive").insertOne(data);

    return NextResponse.json({ message: "Project created successfully!", projectId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
