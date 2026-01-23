import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, ArrowRight, LayoutDashboard } from "lucide-react";
import { blogPosts, categories, getBlogPostsByCategory } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const posts = getBlogPostsByCategory(activeCategory);
  const { user } = useAuth();

  const categoryLabels: Record<string, string> = {
    negotiation: "Negotiation Tips",
    "salary-guides": "Salary Guides",
    "career-advice": "Career Advice",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.png" alt="Underpaid" className="h-7 w-7 rounded-lg" />
              <span className="font-semibold text-foreground hidden sm:inline">Underpaid</span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              {user && (
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              )}
              <Link to="/blog" className="text-foreground font-medium">
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

      {/* Hero */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Salary & Negotiation Insights
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Practical guidance for understanding your compensation, negotiating effectively, 
            and making informed career decisions.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b border-border">
        <div className="max-w-4xl mx-auto px-4">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger key={category.value} value={category.value}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid gap-8">
            {posts.map((post) => (
              <article 
                key={post.slug} 
                className="border border-border rounded-lg p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {categoryLabels[post.category]}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.readTime} min read
                  </span>
                </div>
                
                <Link to={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                </Link>
                
                <p className="text-muted-foreground mb-4">
                  {post.excerpt}
                </p>
                
                <Link 
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Read article
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Wondering if you're paid fairly?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Get a personalized analysis of your compensation in under 2 minutes.
          </p>
          <Link to="/">
            <Button>Check Your Salary</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
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
            "@type": "Blog",
            "name": "Underpaid Blog",
            "description": "Salary negotiation tips, industry salary guides, and career advice",
            "url": "https://www.underpaidapp.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Underpaid",
              "url": "https://www.underpaidapp.com"
            },
            "blogPost": blogPosts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.metaDescription,
              "url": `https://www.underpaidapp.com/blog/${post.slug}`,
              "datePublished": post.publishedAt,
              "author": {
                "@type": "Organization",
                "name": "Underpaid"
              }
            }))
          })
        }}
      />
    </div>
  );
};

export default Blog;
