'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

/**
 * Generates an array of page numbers and ellipsis markers to display.
 * Shows first page, ellipsis, around-current pages, ellipsis, last page.
 * Max 7 visible items (including ellipsis markers).
 */
function getPageRange(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];

  // Always show first page
  pages.push(1);

  if (currentPage > 3) {
    pages.push('ellipsis');
  }

  // Pages around current
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis');
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
}

export default function BlogPagination({
  currentPage,
  totalPages,
  basePath,
}: BlogPaginationProps) {
  const router = useRouter();
  const pageRange = getPageRange(currentPage, totalPages);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    if (page === 1) {
      router.push(basePath);
    } else {
      router.push(`${basePath}/page/${page}`);
    }
  };

  return (
    <nav aria-label="Blog pagination" className="mt-12">
      <div className="flex flex-row items-center justify-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          aria-disabled={currentPage <= 1}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-full transition-colors ${
            currentPage <= 1
              ? 'opacity-50 cursor-not-allowed text-gray-400'
              : 'text-gray-700 hover:bg-saffron-50 hover:border-saffron-300 border border-gray-200 bg-white'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {/* Page numbers */}
        {pageRange.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-gray-400 select-none"
              >
                ...
              </span>
            );
          }

          const isActive = item === currentPage;

          return (
            <button
              key={item}
              onClick={() => goToPage(item)}
              aria-label={`Page ${item}`}
              aria-current={isActive ? 'page' : undefined}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-saffron-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-saffron-50 hover:border-saffron-300'
              }`}
            >
              {item}
            </button>
          );
        })}

        {/* Next button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          aria-disabled={currentPage >= totalPages}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-full transition-colors ${
            currentPage >= totalPages
              ? 'opacity-50 cursor-not-allowed text-gray-400'
              : 'text-gray-700 hover:bg-saffron-50 hover:border-saffron-300 border border-gray-200 bg-white'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
