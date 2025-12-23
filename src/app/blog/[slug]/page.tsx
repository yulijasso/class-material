import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post = await db.post.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post || post.status !== "published") {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to blog
      </Link>

      <article className="space-y-6">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {post.author?.name && <span>By {post.author.name}</span>}
            {post.publishedAt && (
              <span>{format(post.publishedAt, "MMMM d, yyyy")}</span>
            )}
            {post.category && (
              <Badge variant="secondary">{post.category.name}</Badge>
            )}
          </div>
          {post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map(({ tag }) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {post.content.split("\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
