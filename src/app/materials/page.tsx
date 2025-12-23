import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Folder, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileIcon() {
  return <FileText className="h-5 w-5" />;
}

export default async function MaterialsPage() {
  const folders = await db.folder.findMany({
    where: { parentId: null },
    include: {
      materials: true,
      children: {
        include: { materials: true },
      },
    },
    orderBy: { orderIndex: "asc" },
  });

  const uncategorizedMaterials = await db.material.findMany({
    where: { folderId: null },
    orderBy: { orderIndex: "asc" },
  });

  const hasMaterials = folders.length > 0 || uncategorizedMaterials.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Class Materials</h1>

      {!hasMaterials ? (
        <p className="text-muted-foreground">No materials uploaded yet.</p>
      ) : (
        <div className="space-y-8">
          {folders.map((folder) => (
            <div key={folder.id} className="space-y-4">
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                <h2 className="text-xl font-semibold">{folder.name}</h2>
              </div>

              {folder.materials.length > 0 && (
                <div className="grid gap-3 pl-7">
                  {folder.materials.map((material) => (
                    <Card key={material.id}>
                      <CardHeader className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getFileIcon()}
                            <div>
                              <CardTitle className="text-base">
                                {material.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(material.fileSize)} &middot;{" "}
                                {formatDistanceToNow(material.createdAt, {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </div>
                          <a
                            href={material.fileUrl}
                            download={material.fileName}
                            className="p-2 hover:bg-muted rounded-md transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      </CardHeader>
                      {material.description && (
                        <CardContent className="pt-0 pb-3">
                          <p className="text-sm text-muted-foreground">
                            {material.description}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}

          {uncategorizedMaterials.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Other Materials</h2>
              <div className="grid gap-3">
                {uncategorizedMaterials.map((material) => (
                  <Card key={material.id}>
                    <CardHeader className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getFileIcon()}
                          <div>
                            <CardTitle className="text-base">
                              {material.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(material.fileSize)} &middot;{" "}
                              {formatDistanceToNow(material.createdAt, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                        <a
                          href={material.fileUrl}
                          download={material.fileName}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    </CardHeader>
                    {material.description && (
                      <CardContent className="pt-0 pb-3">
                        <p className="text-sm text-muted-foreground">
                          {material.description}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
