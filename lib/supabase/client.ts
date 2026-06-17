'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

/**
 * Browser-side Supabase client for use in Client Components.
 * Uses the anon public key — secured via RLS policies.
 */
export const createClient = () => createClientComponentClient<Database>();
