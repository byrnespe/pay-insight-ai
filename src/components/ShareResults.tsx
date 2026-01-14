import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Twitter, Linkedin, Link2, Check, Facebook, Mail, MessageCircle } from "lucide-react";
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

  const handleFacebookShare = () => {
    const facebookUrl = encodeURIComponent(siteUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${facebookUrl}`, "_blank", "width=550,height=420");
  };

  const handleWhatsAppShare = () => {
    const whatsappText = encodeURIComponent(`${shareText} ${siteUrl}`);
    window.open(`https://wa.me/?text=${whatsappText}`, "_blank");
  };

  const handleRedditShare = () => {
    const redditUrl = encodeURIComponent(siteUrl);
    const redditTitle = encodeURIComponent(shareText);
    window.open(`https://www.reddit.com/submit?url=${redditUrl}&title=${redditTitle}`, "_blank", "width=550,height=420");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("Check if you're being paid fairly");
    const body = encodeURIComponent(`${shareText}\n\n${siteUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
          onClick={handleFacebookShare}
          className="gap-2"
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleWhatsAppShare}
          className="gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRedditShare}
          className="gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
          </svg>
          Reddit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEmailShare}
          className="gap-2"
        >
          <Mail className="w-4 h-4" />
          Email
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
