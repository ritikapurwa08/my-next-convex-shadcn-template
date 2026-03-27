import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { subject, topic, setName } = await request.json();

    if (!subject || !topic || !setName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dirPath = path.join(process.cwd(), "data", "questions", subject, topic);
    const filePath = path.join(dirPath, `${setName}.json`);

    try {
      await fs.unlink(filePath);
      
      // Attempt to clean up empty directories
      try {
        const topicFiles = await fs.readdir(dirPath);
        if (topicFiles.length === 0) {
          await fs.rmdir(dirPath);
          const subjectPath = path.join(process.cwd(), "data", "questions", subject);
          const subjectDirs = await fs.readdir(subjectPath);
          if (subjectDirs.length === 0) {
            await fs.rmdir(subjectPath);
          }
        }
      } catch (cleanupError) {
        // Ignore folder cleanup errors
        console.error("Cleanup error:", cleanupError);
      }

    } catch (err: unknown) {
      if (err !== null && typeof err === 'object' && 'code' in err && err.code === "ENOENT") {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      throw err;
    }

    return NextResponse.json({ message: "Set deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error deleting quiz set:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

