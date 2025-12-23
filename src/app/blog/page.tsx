import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default async function BlogPage() {
  const posts = await db.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="group">
              <Link href={`/blog/${post.slug}`} className="block space-y-2">
                <h2 className="text-xl font-semibold group-hover:underline">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {post.publishedAt && (
                    <span>
                      {formatDistanceToNow(post.publishedAt, { addSuffix: true })}
                    </span>
                  )}
                  {post.category && (
                    <Badge variant="secondary">{post.category.name}</Badge>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
