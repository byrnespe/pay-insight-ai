import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareResultsProps {
  verdict: "underpaid" | "overpaid" | "fair";
  differencePercent: number;
}

export function ShareResults({ verdict, differencePercent }: ShareResultsProps) {
  const [copied, setCopied] = useState(false);
  
  const siteUrl = window.location.origin;
  
  const getShareText = () => {
    if (verdict === "underpaid") {
      return `I just found out I might be ${Math.abs(differencePercent)}% underpaid. Check if you are too:`;
    } else if (verdict === "overpaid") {
      return `I checked my salary against market data. Are you being paid fairly?`;
    }
    return `I just ran a salary check. Curious where you stand?`;
  };

  const shareText = getShareText();

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(`${shareText} ${siteUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank", "width=550,height=420");
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = encodeURIComponent(siteUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${linkedInUrl}`, "_blank", "width=550,height=420");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Card className="p-5">
      <h3 className="font-semibold text-foreground mb-3">Share with others</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Know someone who might be underpaid? Help them find out.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleTwitterShare}
          className="gap-2"
        >
          <Twitter className="w-4 h-4" />
          Tweet
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLinkedInShare}
          className="gap-2"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
