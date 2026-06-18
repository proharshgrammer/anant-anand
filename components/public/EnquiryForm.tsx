'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitEnquiry } from '@/app/actions/enquiry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2 } from 'lucide-react';

// ── Form validation schema ───────────────────────────────────
const formSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .max(20)
    .regex(/^[+\d\s\-()]+$/, 'Enter a valid phone number'),
  message: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EnquiryFormProps {
  /** Pre-filled tour name (shown to user and sent to Supabase) */
  tourName?: string;
  tourId?: string;
  sourcePage?: string;
  onSuccess?: () => void;
}

/**
 * EnquiryForm — Lead capture form using react-hook-form + Zod validation.
 * Calls the `submitEnquiry` server action on submit (LEAD-01).
 * Primary CTA text: "Get a Quote" (UI-SPEC).
 * Error copy: "Failed to submit enquiry. Please call us directly." (UI-SPEC).
 */
export default function EnquiryForm({
  tourName,
  tourId,
  sourcePage,
  onSuccess,
}: EnquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setServerError(null);

    const result = await submitEnquiry({
      ...data,
      email: data.email || undefined,
      message: data.message || undefined,
      source_page: sourcePage,
      tour_name: tourName,
      tour_id: tourId,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      reset();
      onSuccess?.();
    } else {
      // Exact error copy from UI-SPEC
      setServerError(result.error || 'Failed to submit enquiry. Please call us directly.');
    }
  };

  // ── Success state ──────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Enquiry Submitted!
          </h3>
          <p className="text-sm text-gray-600">
            We'll reach out to you within 24 hours. Check your WhatsApp or email.
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm text-orange-600 hover:underline"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {tourName && (
        <div className="bg-orange-50 border border-orange-100 rounded-lg px-4 py-2.5">
          <p className="text-xs text-orange-700 font-medium">
            Enquiring about: <span className="font-semibold">{tourName}</span>
          </p>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="enquiry-name" className="text-sm font-medium text-gray-700">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="enquiry-name"
          placeholder="e.g. Ramesh Sharma"
          {...register('name')}
          className={errors.name ? 'border-red-400 focus-visible:ring-red-400' : ''}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
        />
        {errors.name && (
          <p id="enquiry-name-error" className="text-xs text-red-500 mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="enquiry-phone" className="text-sm font-medium text-gray-700">
          Phone / WhatsApp <span className="text-red-500">*</span>
        </Label>
        <Input
          id="enquiry-phone"
          type="tel"
          placeholder="+91 98765 43210"
          {...register('phone')}
          className={errors.phone ? 'border-red-400 focus-visible:ring-red-400' : ''}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'enquiry-phone-error' : undefined}
        />
        {errors.phone && (
          <p id="enquiry-phone-error" className="text-xs text-red-500 mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Email (optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="enquiry-email" className="text-sm font-medium text-gray-700">
          Email <span className="text-gray-400 text-xs font-normal">(optional)</span>
        </Label>
        <Input
          id="enquiry-email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          className={errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'enquiry-email-error' : undefined}
        />
        {errors.email && (
          <p id="enquiry-email-error" className="text-xs text-red-500 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="enquiry-message" className="text-sm font-medium text-gray-700">
          Message <span className="text-gray-400 text-xs font-normal">(optional)</span>
        </Label>
        <Textarea
          id="enquiry-message"
          placeholder="Tell us your travel dates, group size, any special requirements…"
          rows={3}
          {...register('message')}
          className="resize-none"
        />
      </div>

      {/* Server error — exact copy from UI-SPEC */}
      {serverError && (
        <p
          id="enquiry-server-error"
          role="alert"
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
        >
          {serverError}
        </p>
      )}

      {/* Submit — "Get a Quote" (UI-SPEC) */}
      <Button
        id="enquiry-submit-btn"
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting…
          </>
        ) : (
          'Get a Quote'
        )}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        We respect your privacy. No spam, ever.
      </p>
    </form>
  );
}
