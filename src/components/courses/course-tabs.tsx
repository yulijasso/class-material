"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Paperclip,
  Plus,
  Trash2,
  Download,
  ChevronDown,
  ChevronRight,
  FolderPlus,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { FileUploadDialog } from "./file-upload-dialog";
import { SectionDialog } from "./section-dialog";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

type File = {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
};

type Section = {
  id: string;
  title: string;
  orderIndex: number;
  notes: Note[];
  files: File[];
};

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  sections: Section[];
  notes: Note[];
  files: File[];
};

interface CourseTabsProps {
  courses: Course[];
}

const tabColors = [
  { bg: "bg-yellow-400", hover: "hover:bg-yellow-500", content: "bg-yellow-400", text: "text-yellow-900" },
  { bg: "bg-orange-400", hover: "hover:bg-orange-500", content: "bg-orange-400", text: "text-orange-900" },
  { bg: "bg-pink-400", hover: "hover:bg-pink-500", content: "bg-pink-400", text: "text-pink-900" },
  { bg: "bg-purple-400", hover: "hover:bg-purple-500", content: "bg-purple-400", text: "text-purple-900" },
  { bg: "bg-blue-400", hover: "hover:bg-blue-500", content: "bg-blue-400", text: "text-blue-900" },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function CourseTabs({ courses }: CourseTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(courses[0]?.slug || "");
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const activeIndex = courses.findIndex((c) => c.slug === activeTab);
  const activeCourse = courses[activeIndex];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const handleAddNote = (sectionId?: string) => {
    const url = sectionId
      ? `/courses/new-note?courseId=${activeCourse.id}&sectionId=${sectionId}`
      : `/courses/new-note?courseId=${activeCourse.id}`;
    router.push(url);
  };

  const handleUploadFile = (sectionId?: string) => {
    setSelectedSectionId(sectionId || null);
    setFileDialogOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    await fetch(`/api/courses/notes?id=${noteId}`, { method: "DELETE" });
    window.location.reload();
  };

  const handleDeleteFile = async (fileId: string) => {
    await fetch(`/api/courses/files?id=${fileId}`, { method: "DELETE" });
    window.location.reload();
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section? Notes and files will be moved to unsorted.")) return;
    await fetch(`/api/courses/sections?id=${sectionId}`, { method: "DELETE" });
    window.location.reload();
  };

  const renderNoteCard = (note: Note) => (
    <div
      key={note.id}
      className="bg-gray-50 rounded-xl p-4 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{note.title}</h3>
            <p className="text-xs text-gray-500">
              {format(new Date(note.createdAt), "MMM d, yyyy")} at{" "}
              {format(new Date(note.createdAt), "h:mm a")}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-red-500"
          onClick={() => handleDeleteNote(note.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div
        className="mt-3 prose prose-sm prose-gray max-w-none text-gray-600 line-clamp-3"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </div>
  );

  const renderFileCard = (file: File) => (
    <div
      key={file.id}
      className="bg-gray-50 rounded-xl p-4 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Paperclip className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{file.title}</h3>
            <p className="text-xs text-gray-500">
              {file.fileName} &middot; {formatFileSize(file.fileSize)}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <a
            href={file.fileUrl}
            download={file.fileName}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <Download className="h-4 w-4" />
          </a>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-500"
            onClick={() => handleDeleteFile(file.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative h-full flex flex-col">
      {/* Folder Tabs */}
      <div className="flex relative">
        {courses.map((course, index) => {
          const color = tabColors[index % tabColors.length];
          const isActive = activeTab === course.slug;

          return (
            <button
              key={course.slug}
              onClick={() => setActiveTab(course.slug)}
              className={cn(
                "relative px-8 py-4 text-base font-semibold text-white rounded-t-xl transition-all",
                "shadow-md",
                color.bg,
                color.hover,
                isActive ? "z-10 -mb-1 pb-5" : "z-0 opacity-90",
                index > 0 && "-ml-3"
              )}
              style={{
                clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
              }}
            >
              {course.title}
            </button>
          );
        })}
      </div>

      {/* Folder Content Area */}
      {activeCourse && (
        <div className="flex-1 rounded-b-2xl rounded-tr-2xl p-8 shadow-xl bg-white overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {activeCourse.title}
              </h2>
              {activeCourse.description && (
                <p className="mt-2 text-lg text-gray-600">
                  {activeCourse.description}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="shadow-sm"
                onClick={() => setSectionDialogOpen(true)}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
              <Button
                className="bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
                onClick={() => handleAddNote()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
              <Button
                variant="outline"
                className="shadow-sm"
                onClick={() => handleUploadFile()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {activeCourse.sections.map((section) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Section Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 bg-gray-100 cursor-pointer hover:bg-gray-150"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-2">
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                    <h3 className="font-semibold text-gray-800">{section.title}</h3>
                    <span className="text-sm text-gray-500">
                      ({section.notes.length + section.files.length} items)
                    </span>
                  </div>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => handleAddNote(section.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => handleDeleteSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Section Content */}
                {expandedSections.has(section.id) && (
                  <div className="p-4 space-y-3 bg-white">
                    {section.notes.length === 0 && section.files.length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-4">
                        No content in this section yet
                      </p>
                    )}
                    {section.notes.map(renderNoteCard)}
                    {section.files.map(renderFileCard)}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500"
                        onClick={() => handleAddNote(section.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Note
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500"
                        onClick={() => handleUploadFile(section.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Unsorted Content */}
            {(activeCourse.notes.length > 0 || activeCourse.files.length > 0) && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                  Unsorted
                </h3>
                <div className="space-y-3">
                  {activeCourse.notes.map(renderNoteCard)}
                  {activeCourse.files.map(renderFileCard)}
                </div>
              </div>
            )}

            {/* Empty State */}
            {activeCourse.sections.length === 0 &&
              activeCourse.notes.length === 0 &&
              activeCourse.files.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-xl text-gray-500">No content yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Add a section, note, or file to get started
                  </p>
                </div>
              )}
          </div>

          {/* Dialogs */}
          <FileUploadDialog
            open={fileDialogOpen}
            onOpenChange={setFileDialogOpen}
            courseId={activeCourse.id}
            sectionId={selectedSectionId}
          />
          <SectionDialog
            open={sectionDialogOpen}
            onOpenChange={setSectionDialogOpen}
            courseId={activeCourse.id}
          />
        </div>
      )}
    </div>
  );
}
