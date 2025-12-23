import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, courseId } = await req.json();

    // Get the highest orderIndex for this course
    const lastSection = await db.courseSection.findFirst({
      where: { courseId },
      orderBy: { orderIndex: "desc" },
    });

    const section = await db.courseSection.create({
      data: {
        title,
        courseId,
        orderIndex: (lastSection?.orderIndex ?? -1) + 1,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("Failed to create section:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title, orderIndex } = await req.json();

    const section = await db.courseSection.update({
      where: { id },
      data: { title, orderIndex },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("Failed to update section:", error);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.courseSection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete section:", error);
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    );
  }
}
