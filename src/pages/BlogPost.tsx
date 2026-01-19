import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Clock, Share2, Twitter, Linkedin } from "lucide-react";
import { getBlogPost, getRelatedPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import MarkdownContent from "@/components/MarkdownContent";
import { useEffect } from "react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;
  const relatedPosts = slug ? getRelatedPosts(slug, 3) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const categoryLabels: Record<string, string> = {
    negotiation: "Negotiation Tips",
    "salary-guides": "Salary Guides",
    "career-advice": "Career Advice",
  };

  const shareUrl = `https://www.underpaidapp.com/blog/${post.slug}`;
  const shareText = post.title;

  const handleShare = (platform: string) => {
    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "native":
        if (navigator.share) {
          navigator.share({ title: shareText, url: shareUrl });
          return;
        }
        break;
    }
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.png" alt="Underpaid" className="h-7 w-7 rounded-lg" />
              <span className="font-semibold text-foreground hidden sm:inline">Underpaid</span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Article */}
      <article className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
              {categoryLabels[post.category]}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {post.readTime} min read
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-muted-foreground mb-8 border-l-2 border-primary pl-4">
            {post.excerpt}
          </p>

          {/* Content */}
          <div className="mb-12">
            <MarkdownContent content={post.content} />
          </div>

          {/* Share */}
          <div className="border-t border-border pt-8 mb-12">
            <p className="text-sm text-muted-foreground mb-4">Share this article</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleShare("twitter")}
                className="gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleShare("linkedin")}
                className="gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleShare("native")}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-muted/50 border border-border rounded-lg p-6 mb-12 text-center">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Wondering if you're paid fairly?
            </h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Get a personalized analysis of your compensation in under 2 minutes.
            </p>
            <Link to="/">
              <Button>Check Your Salary</Button>
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="border-t border-border pt-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Related Articles
              </h2>
              <div className="grid gap-4">
                {relatedPosts.map((related) => (
                  <Link 
                    key={related.slug}
                    to={`/blog/${related.slug}`}
                    className="block border border-border rounded-lg p-4 hover:border-primary/30 transition-colors"
                  >
                    <span className="text-xs text-primary mb-1 block">
                      {categoryLabels[related.category]}
                    </span>
                    <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Calculator
            </Link>
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Underpaid. All rights reserved.
          </p>
        </div>
      </footer>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.metaDescription,
            "url": shareUrl,
            "datePublished": post.publishedAt,
            "author": {
              "@type": "Organization",
              "name": "Underpaid",
              "url": "https://www.underpaidapp.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Underpaid",
              "url": "https://www.underpaidapp.com"
            }
          })
        }}
      />
    </div>
  );
};

export default BlogPost;
