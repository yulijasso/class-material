import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { MediumEditor } from "@/components/courses/medium-editor";

interface Props {
  searchParams: Promise<{ courseId?: string; sectionId?: string }>;
}

export default async function NewNotePage({ searchParams }: Props) {
  const { courseId, sectionId } = await searchParams;

  if (!courseId) {
    redirect("/courses");
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    redirect("/courses");
  }

  return (
    <MediumEditor
      courseId={course.id}
      courseSlug={course.slug}
      sectionId={sectionId}
    />
  );
}
