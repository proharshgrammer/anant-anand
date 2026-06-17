import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Server-side Supabase client for use in Server Components and API routes.
 * Reads session from cookies — never exposed to the client.
 */
export const createServerClient = () =>
  createServerComponentClient<Database>({ cookies });
