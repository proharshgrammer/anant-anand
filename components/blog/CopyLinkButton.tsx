'use client';

import { useState } from 'react';
import { Link, Check } from 'lucide-react';

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
      setCopied(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
      aria-label={copied ? 'Link copied' : 'Copy link to clipboard'}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          <span className="text-green-600 font-medium">Link copied!</span>
        </>
      ) : (
        <>
          <Link className="h-4 w-4 text-gray-600" />
          <span className="text-gray-700">Copy Link</span>
        </>
      )}
    </button>
  );
}
