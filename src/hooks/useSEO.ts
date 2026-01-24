import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
}

const BASE_URL = "https://www.underpaidapp.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export const useSEO = ({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    const fullTitle = title.includes("Underpaid") ? title : `${title} | Underpaid`;
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // Update meta description
    setMetaTag("description", description);

    // Update Open Graph tags
    setMetaTag("og:title", fullTitle, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:type", ogType, true);
    setMetaTag("og:image", ogImage, true);
    
    if (canonical) {
      setMetaTag("og:url", `${BASE_URL}${canonical}`, true);
      
      // Update canonical link
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", `${BASE_URL}${canonical}`);
    }

    // Update Twitter tags
    setMetaTag("twitter:title", fullTitle);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", ogImage);

    // Handle noindex for non-public pages
    if (noIndex) {
      setMetaTag("robots", "noindex, nofollow");
    } else {
      const robotsTag = document.querySelector('meta[name="robots"]');
      if (robotsTag) {
        robotsTag.remove();
      }
    }

    // Cleanup function to reset to defaults when component unmounts
    return () => {
      document.title = "Underpaid | AI Salary Analysis";
    };
  }, [title, description, canonical, ogImage, ogType, noIndex]);
};
