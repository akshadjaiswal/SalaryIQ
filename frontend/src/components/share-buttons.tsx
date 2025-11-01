"use client";

import { useState } from "react";
import { Twitter, Linkedin, Link2, Check } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { formatPercentage } from "@/lib/utils";
import { toast } from "sonner";

// ============================================
// SHARE BUTTONS COMPONENT
// ============================================

interface ShareButtonsProps {
  result: AnalysisResult;
}

export function ShareButtons({ result }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://salaryiq.vercel.app";
  const shareUrl = `${appUrl}/results/${result.id}`;

  // Generate share text
  const getShareText = () => {
    const verdictEmoji = {
      underpaid: "📉",
      fair: "✅",
      overpaid: "🎉",
    }[result.verdict];

    const verdictText = {
      underpaid: `I'm ${formatPercentage(Math.abs(result.difference))} UNDERPAID`,
      fair: "I'm getting paid fairly for my role",
      overpaid: `I'm ${formatPercentage(result.difference)} ABOVE market rate`,
    }[result.verdict];

    return `${verdictEmoji} ${verdictText}! Find out your true market value at`;
  };

  const shareText = getShareText();

  // Share handlers
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
    toast.success("Opening Twitter...");
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
    toast.success("Opening LinkedIn...");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
      {/* Twitter */}
      <button
        onClick={handleTwitterShare}
        className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg font-semibold transition-colors duration-200 w-full sm:w-auto justify-center"
      >
        <Twitter className="h-5 w-5" />
        Share on Twitter
      </button>

      {/* LinkedIn */}
      <button
        onClick={handleLinkedInShare}
        className="flex items-center gap-2 px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg font-semibold transition-colors duration-200 w-full sm:w-auto justify-center"
      >
        <Linkedin className="h-5 w-5" />
        Share on LinkedIn
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white rounded-lg font-semibold transition-colors duration-200 w-full sm:w-auto justify-center"
      >
        {copied ? (
          <>
            <Check className="h-5 w-5" />
            Copied!
          </>
        ) : (
          <>
            <Link2 className="h-5 w-5" />
            Copy Link
          </>
        )}
      </button>
    </div>
  );
}
