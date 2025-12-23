"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText, Paperclip, Plus, Trash2, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { NoteDialog } from "./note-dialog";
import { FileUploadDialog } from "./file-upload-dialog";

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  notes: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
  }[];
  files: {
    id: string;
    title: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    createdAt: Date;
  }[];
};

interface CourseContentProps {
  course: Course;
  color: {
    bg: string;
    hover: string;
    content: string;
    text: string;
  };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function CourseContent({ course, color }: CourseContentProps) {
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);

  const handleDeleteNote = async (noteId: string) => {
    await fetch(`/api/courses/notes?id=${noteId}`, { method: "DELETE" });
    window.location.reload();
  };

  const handleDeleteFile = async (fileId: string) => {
    await fetch(`/api/courses/files?id=${fileId}`, { method: "DELETE" });
    window.location.reload();
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={cn("text-2xl font-bold", color.text)}>
            {course.title}
          </h2>
          {course.description && (
            <p className={cn("mt-1 opacity-80", color.text)}>
              {course.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white text-gray-800"
            onClick={() => setNoteDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white text-gray-800"
            onClick={() => setFileDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Upload File
          </Button>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-3">
        {course.notes.length === 0 && course.files.length === 0 && (
          <p className={cn("text-center py-12 opacity-70", color.text)}>
            No content yet. Add a note or upload a file to get started.
          </p>
        )}

        {/* Notes */}
        {course.notes.map((note) => (
          <div key={note.id} className="bg-white/95 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">{note.title}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(note.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-500"
                onClick={() => handleDeleteNote(note.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">
              {note.content}
            </p>
          </div>
        ))}

        {/* Files */}
        {course.files.map((file) => (
          <div key={file.id} className="bg-white/95 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Paperclip className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-900">{file.title}</h3>
                  <p className="text-sm text-gray-500">
                    {file.fileName} &middot; {formatFileSize(file.fileSize)}{" "}
                    &middot;{" "}
                    {formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <a
                  href={file.fileUrl}
                  download={file.fileName}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                >
                  <Download className="h-4 w-4" />
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => handleDeleteFile(file.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <NoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        courseId={course.id}
      />
      <FileUploadDialog
        open={fileDialogOpen}
        onOpenChange={setFileDialogOpen}
        courseId={course.id}
      />
    </>
  );
}
