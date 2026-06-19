import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const fallbackImage =
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  const postImage = post.featured_image || fallbackImage;
  const postImageAlt = post.featured_image_alt || post.title;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full group">
      {/* Image container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={postImage}
          alt={postImageAlt}
          width={800}
          height={450}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {post.category && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-saffron-800 shadow-sm capitalize">
            {post.category}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 font-display line-clamp-2">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-saffron-600 transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 text-base leading-relaxed line-clamp-3 mt-2 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Metadata row */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6 mt-auto">
          {post.published_at && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-saffron-500" />
              {formatDate(post.published_at)}
            </div>
          )}
          {post.read_time_minutes != null && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-saffron-500" />
              <span>{post.read_time_minutes} min read</span>
            </div>
          )}
          {post.author_name && (
            <span>{post.author_name}</span>
          )}
        </div>
      </div>

      {/* CTA section */}
      <div className="px-6 pb-6">
        <div className="pt-4 border-t border-gray-100">
          <Link
            href={`/blog/${post.slug}`}
            className="text-royal-600 font-semibold hover:text-royal-800 transition-colors"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}
