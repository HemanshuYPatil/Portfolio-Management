import { connectToDatabase } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const { id } = await request.json(); 

  try {
    const { db } = await connectToDatabase();

    
    const result = await db.collection("unactive").deleteOne({ _id: new ObjectId(id) });

  
    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Project deleted successfully!" }, { status: 200 });
    } else {
     
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
