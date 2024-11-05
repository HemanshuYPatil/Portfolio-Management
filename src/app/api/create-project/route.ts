// pages/api/work/createProject.js

import { connectToDatabase } from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { title, date, summary, description, id, roles, links } = await request.json();

  try {
    const { db } = await connectToDatabase();

    const newProject = {
      title,
      date,
      details: {
        description,
        summary,
      },
      id,
      roles,
      links,
    };

    const result = await db.collection("work").insertOne(newProject);

    return NextResponse.json({ message: "Project created successfully!", projectId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
