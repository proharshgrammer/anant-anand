'use client';

import { useState, useEffect } from 'react';

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface BlogTableOfContentsProps {
  headings: Heading[];
}

export default function BlogTableOfContents({
  headings,
}: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // Intersection Observer for scroll tracking
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-24 bg-white rounded-xl border border-gray-100 shadow-sm p-4 w-full">
        <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
          On This Page
        </p>
        <nav aria-label="Table of contents">
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading.id)}
                  className={`block text-sm transition-colors rounded ${
                    heading.level === 2
                      ? 'pl-0 font-semibold text-gray-700 hover:text-saffron-600'
                      : 'pl-4 text-gray-500 hover:text-saffron-600'
                  } ${
                    activeId === heading.id
                      ? 'text-saffron-600 font-semibold border-l-2 border-saffron-500 -ml-4 pl-3'
                      : ''
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile collapsible */}
      <div className="lg:hidden mt-8">
        <details className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <summary className="p-4 text-sm font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-50 rounded-xl transition-colors">
            On This Page
          </summary>
          <nav aria-label="Table of contents" className="px-4 pb-4">
            <ul className="space-y-1">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    className={`block text-sm transition-colors rounded py-1 ${
                      heading.level === 2
                        ? 'pl-0 font-semibold text-gray-700 hover:text-saffron-600'
                        : 'pl-4 text-gray-500 hover:text-saffron-600'
                    } ${
                      activeId === heading.id
                        ? 'text-saffron-600 font-semibold border-l-2 border-saffron-500'
                        : ''
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </>
  );
}
