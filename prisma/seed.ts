import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.upsert({
    where: { email: "admin@yuliutaustin.com" },
    update: {},
    create: {
      email: "admin@yuliutaustin.com",
      name: "Admin",
      role: "admin",
    },
  });

  // Create categories
  const blogCategory = await prisma.category.upsert({
    where: { slug: "tutorials" },
    update: {},
    create: {
      name: "Tutorials",
      slug: "tutorials",
    },
  });

  // Create tags
  const tag1 = await prisma.tag.upsert({
    where: { slug: "getting-started" },
    update: {},
    create: { name: "Getting Started", slug: "getting-started" },
  });

  const tag2 = await prisma.tag.upsert({
    where: { slug: "web-dev" },
    update: {},
    create: { name: "Web Dev", slug: "web-dev" },
  });

  // Create a sample post
  const post = await prisma.post.upsert({
    where: { slug: "welcome-to-yuliutaustin" },
    update: {},
    create: {
      title: "Welcome to yuliutaustin",
      slug: "welcome-to-yuliutaustin",
      content:
        "Welcome to yuliutaustin! This is a minimal platform for sharing blog posts and organizing class materials.\n\nYou can use the blog section to share thoughts, tutorials, and updates. The materials section helps you organize and share class resources with your students.\n\nGet started by creating your first post or uploading some materials!",
      excerpt: "An introduction to the yuliutaustin platform.",
      status: "published",
      publishedAt: new Date(),
      authorId: user.id,
      categoryId: blogCategory.id,
    },
  });

  // Connect tags to post
  await prisma.postTag.upsert({
    where: { postId_tagId: { postId: post.id, tagId: tag1.id } },
    update: {},
    create: { postId: post.id, tagId: tag1.id },
  });

  await prisma.postTag.upsert({
    where: { postId_tagId: { postId: post.id, tagId: tag2.id } },
    update: {},
    create: { postId: post.id, tagId: tag2.id },
  });

  // Create a folder
  const folder = await prisma.folder.upsert({
    where: { id: "week-1-folder" },
    update: {},
    create: {
      id: "week-1-folder",
      name: "Week 1 - Introduction",
      orderIndex: 1,
    },
  });

  // Create courses
  const courses = [
    { title: "Case Studies in Machine Learning", slug: "case-studies-ml", orderIndex: 1 },
    { title: "Machine Learning", slug: "machine-learning", orderIndex: 2 },
    { title: "Deep Learning", slug: "deep-learning", orderIndex: 3 },
    { title: "Advances in Deep Learning", slug: "advances-in-deep-learning", orderIndex: 4 },
    { title: "Natural Language Processing", slug: "natural-language-processing", orderIndex: 5 },
    { title: "Algorithms", slug: "algorithms", orderIndex: 6 },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: { orderIndex: course.orderIndex },
      create: course,
    });
  }

  console.log("Seed completed!");
  console.log({ user, post, folder, coursesCreated: courses.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
