export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: "draft" | "published";
  authorId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
};

export type Material = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  folderId: string | null;
  categoryId: string | null;
  authorId: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Folder = {
  id: string;
  name: string;
  parentId: string | null;
  orderIndex: number;
  createdAt: Date;
  children?: Folder[];
  materials?: Material[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  createdAt: Date;
};
