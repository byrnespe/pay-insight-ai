import { useEffect } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export const FAQSchema = ({ faqs }: FAQSchemaProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-schema";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });

    // Remove existing FAQ schema if present
    const existing = document.getElementById("faq-schema");
    if (existing) existing.remove();

    document.head.appendChild(script);

    return () => {
      const el = document.getElementById("faq-schema");
      if (el) el.remove();
    };
  }, [faqs]);

  return null;
};
