import { NextResponse } from "next/server";
import Feedback from "../../../config"; // Adjust path if necessary

export async function POST(req) {
  try {
    const { messageID, feedback } = await req.json();

    if (!messageID || !feedback || !['thumbsUp', 'thumbsDown'].includes(feedback)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Save feedback to MongoDB
    const newFeedback = new Feedback({ messageID, feedback });
    await newFeedback.save();

    return NextResponse.json({ message: "Feedback saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
