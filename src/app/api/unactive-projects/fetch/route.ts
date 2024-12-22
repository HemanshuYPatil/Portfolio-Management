import { connectToDatabase } from "@/lib/mongo";

import { NextResponse } from "next/server";


export async function GET() {
  try {
    const { db } = await connectToDatabase();

   
    const workItems = await db
      .collection("unactive")
      .find({}, { projection: { _id: 1, title: 1 , date: 1, link:1} })
      .toArray();


    return NextResponse.json(workItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching Unactive data:", error);
   
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
