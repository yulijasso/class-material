import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CourseContent } from "@/components/courses/course-content";

const tabColors = [
  { bg: "bg-yellow-400", hover: "hover:bg-yellow-300", content: "bg-yellow-300", text: "text-yellow-900", border: "border-yellow-500" },
  { bg: "bg-orange-400", hover: "hover:bg-orange-300", content: "bg-orange-300", text: "text-orange-900", border: "border-orange-500" },
  { bg: "bg-pink-400", hover: "hover:bg-pink-300", content: "bg-pink-300", text: "text-pink-900", border: "border-pink-500" },
  { bg: "bg-purple-400", hover: "hover:bg-purple-300", content: "bg-purple-300", text: "text-purple-900", border: "border-purple-500" },
  { bg: "bg-blue-400", hover: "hover:bg-blue-300", content: "bg-blue-300", text: "text-blue-900", border: "border-blue-500" },
];

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;

  const courses = await db.course.findMany({
    orderBy: { orderIndex: "asc" },
  });

  const courseIndex = courses.findIndex((c) => c.slug === slug);

  if (courseIndex === -1) {
    notFound();
  }

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      files: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!course) {
    notFound();
  }

  const activeColor = tabColors[courseIndex % tabColors.length];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8">
      <div className="mx-auto max-w-5xl px-4">
        {/* Folder Container */}
        <div className="relative">
          {/* Folder Tabs - staggered like real folder dividers */}
          <div className="flex relative ml-4">
            {courses.map((c, index) => {
              const color = tabColors[index % tabColors.length];
              const isActive = c.slug === slug;
              const offset = index * 8;

              return (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  className={cn(
                    "relative px-5 py-2 text-xs font-bold text-white rounded-t-lg transition-all uppercase tracking-wide",
                    color.bg,
                    color.hover,
                    isActive ? "z-20 pb-3 shadow-lg" : "z-10 opacity-85 hover:opacity-100",
                  )}
                  style={{
                    marginLeft: index === 0 ? `${offset}px` : "-4px",
                    marginTop: isActive ? "0px" : "4px",
                  }}
                >
                  {c.title}
                </Link>
              );
            })}
          </div>

          {/* Main Folder Body */}
          <div
            className={cn(
              "relative rounded-2xl shadow-2xl overflow-hidden",
              activeColor.content
            )}
            style={{
              boxShadow: "0 10px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            {/* Folder top edge detail */}
            <div
              className={cn("h-2 w-full", activeColor.bg)}
              style={{
                boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.1)",
              }}
            />

            {/* Content area */}
            <div className="p-8 min-h-[500px]">
              <CourseContent course={course} color={activeColor} />
            </div>

            {/* Folder bottom shadow for depth */}
            <div
              className="absolute bottom-0 left-0 right-0 h-4 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.05), transparent)",
              }}
            />
          </div>

          {/* Paper stack effect behind folder */}
          <div
            className="absolute -bottom-2 left-4 right-4 h-4 bg-white rounded-b-lg -z-10"
            style={{
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
          <div
            className="absolute -bottom-4 left-8 right-8 h-4 bg-gray-50 rounded-b-lg -z-20"
            style={{
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
