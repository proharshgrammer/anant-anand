/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://anantanandtourpackages.in',
  generateRobotsTxt: true,
  exclude: [
    '/admin/*',
    '/privacy',
    '/terms',
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin' },
    ],
  },
  changefreq: 'weekly',
  priority: 0.7,
};
