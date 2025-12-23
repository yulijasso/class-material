import { db } from "@/lib/db";
import { CourseTabs } from "@/components/courses/course-tabs";
import Link from "next/link";
import { Home } from "lucide-react";

export default async function CoursesPage() {
  const courses = await db.course.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
        include: {
          notes: { orderBy: { createdAt: "desc" } },
          files: { orderBy: { createdAt: "desc" } },
        },
      },
      notes: {
        where: { sectionId: null },
        orderBy: { createdAt: "desc" }
      },
      files: {
        where: { sectionId: null },
        orderBy: { createdAt: "desc" }
      },
    },
  });

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-50 to-gray-100 p-6 overflow-auto">
      {/* Home button */}
      <Link
        href="/"
        className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow z-10"
      >
        <Home className="h-5 w-5 text-gray-600" />
      </Link>

      {courses.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No courses available yet.</p>
        </div>
      ) : (
        <div className="h-full pt-8">
          <CourseTabs courses={courses} />
        </div>
      )}
    </div>
  );
}
