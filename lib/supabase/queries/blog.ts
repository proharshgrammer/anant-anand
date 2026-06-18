import { createClient } from '@/lib/supabase/client';
import type { BlogPost } from '@/types';

/**
 * Fetch all blog posts for admin listing (lightweight columns).
 */
export async function getBlogPosts(): Promise<
  Pick<BlogPost, 'id' | 'title' | 'slug' | 'status' | 'category' | 'published_at' | 'author_name' | 'created_at'>[]
> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, status, category, published_at, author_name, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Pick<BlogPost, 'id' | 'title' | 'slug' | 'status' | 'category' | 'published_at' | 'author_name' | 'created_at'>[];
}

/**
 * Fetch a single blog post with all fields.
 */
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as BlogPost;
}

/**
 * Create a new blog post.
 */
export async function createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post as never)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as BlogPost;
}

/**
 * Update a blog post.
 */
export async function updateBlogPost(
  id: string,
  post: Partial<BlogPost>
): Promise<BlogPost> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .update(post as never)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as BlogPost;
}

/**
 * Delete a blog post.
 */
export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
