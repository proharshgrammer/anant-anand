'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import EnquiryForm from './EnquiryForm';
import { X } from 'lucide-react';

interface EnquiryPopupProps {
  /** Delay in milliseconds before the popup opens (default: 5000) */
  delayMs?: number;
  tourName?: string;
  tourId?: string;
  sourcePage?: string;
}

/**
 * EnquiryPopup — wraps EnquiryForm in a Dialog that opens after a delay.
 * Opens 5 seconds after mount (D-01, LEAD-01).
 * Dismissed by closing the dialog; does NOT reopen after user closes it.
 */
export default function EnquiryPopup({
  delayMs = 5000,
  tourName,
  tourId,
  sourcePage,
}: EnquiryPopupProps) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show again if user already dismissed it in this session
    const alreadyDismissed = sessionStorage.getItem('enquiry-popup-dismissed') === 'true';
    if (alreadyDismissed) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setDismissed(true);
      // Remember dismissal for this browser session
      sessionStorage.setItem('enquiry-popup-dismissed', 'true');
    }
  };

  const handleSuccess = () => {
    // After successful submission, close popup and mark as dismissed
    setTimeout(() => {
      handleOpenChange(false);
    }, 2000);
  };

  if (dismissed && !open) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        id="enquiry-popup-dialog"
        className="sm:max-w-md w-full p-0 overflow-hidden rounded-2xl border-0 shadow-2xl"
        // Hide the default close button so we use our own styled one
        aria-describedby="enquiry-popup-description"
      >
        {/* Header with accent band */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 pt-6 pb-5 text-white relative">
          {/* Custom close button */}
          <button
            onClick={() => handleOpenChange(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            aria-label="Close enquiry popup"
          >
            <X className="w-5 h-5" />
          </button>

          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold text-white text-left">
              ✈️ Plan Your Next Adventure
            </DialogTitle>
            <DialogDescription
              id="enquiry-popup-description"
              className="text-orange-100 text-sm text-left"
            >
              Get a personalised quote in under 24 hours — free, no obligation.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form body */}
        <div className="px-6 py-5 bg-white">
          <EnquiryForm
            tourName={tourName}
            tourId={tourId}
            sourcePage={sourcePage}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
