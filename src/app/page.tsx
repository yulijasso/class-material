import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to yuliutaustin
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          A minimal platform for sharing blog posts and organizing class materials.
        </p>
        <div className="flex gap-4 pt-4">
          <Button asChild>
            <Link href="/blog">
              Read Blog <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/materials">Browse Materials</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
