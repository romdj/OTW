/**
 * OTW.sport Sitemap Configuration
 *
 * Defines all routes and navigation structure for the application.
 * Used for navigation components, breadcrumbs, and SEO.
 */

export interface SitemapRoute {
  path: string;
  title: string;
  description?: string;
  /** Icon (emoji for now, can be replaced with icon components) */
  icon?: string;
  /** Whether this route is currently implemented */
  implemented: boolean;
  /** Child routes */
  children?: SitemapRoute[];
  /** Whether to show in main navigation */
  showInNav?: boolean;
  /** Whether this is a dynamic route segment */
  isDynamic?: boolean;
  /** Parameter name for dynamic routes */
  paramName?: string;
}

/**
 * Main sitemap structure
 */
export const SITEMAP: SitemapRoute[] = [
  {
    path: '/',
    title: 'Sports',
    description: 'OTW.sport - Find Something Worth Watching',
    icon: '🏠',
    implemented: true,
    showInNav: true,
    children: [
      {
        path: '/sports/ice-hockey',
        title: 'Ice Hockey',
        icon: '🏒',
        implemented: true,
        showInNav: true,
        children: [
          {
            path: '/sports/ice-hockey/events',
            title: 'Games',
            description: 'Live, upcoming, and recent games with watchability scores',
            icon: '🎮',
            implemented: true,
            showInNav: true,
          },
          {
            path: '/sports/ice-hockey/watchlist',
            title: 'My Watchlist',
            description: 'Your personal list of games to watch',
            icon: '⭐',
            implemented: true,
            showInNav: true,
          },
          {
            path: '/sports/ice-hockey/history',
            title: 'Unmissable Moments',
            description: 'Historic games and legendary matchups',
            icon: '🏛️',
            implemented: true,
            showInNav: true,
          },
        ],
      },
      {
        path: '/sports/tennis',
        title: 'Tennis',
        icon: '🎾',
        implemented: true,
        showInNav: true,
        children: [
          {
            path: '/sports/tennis/rankings',
            title: 'Rankings',
            description: 'ATP player rankings',
            icon: '📊',
            implemented: true,
            showInNav: true,
          },
          {
            path: '/sports/tennis/tournaments',
            title: 'Tournaments',
            description: 'ATP tour tournaments',
            icon: '🏆',
            implemented: true,
            showInNav: true,
          },
          {
            path: '/sports/tennis/events',
            title: 'Matches',
            description: 'Live and recent matches',
            icon: '📅',
            implemented: true,
            showInNav: true,
          },
        ],
      },
      {
        path: '/sports/american-football',
        title: 'American Football',
        icon: '🏈',
        implemented: false,
        showInNav: true,
        children: [
          {
            path: '/sports/american-football/events',
            title: 'Games',
            description: 'This week\'s must-watch matchups',
            icon: '🎮',
            implemented: false,
            showInNav: true,
          },
        ],
      },
      {
        path: '/sports/association-football',
        title: 'Football',
        icon: '⚽',
        implemented: false,
        showInNav: true,
        children: [
          {
            path: '/sports/association-football/leagues',
            title: 'Leagues',
            description: 'Premier League, La Liga, Serie A, and more',
            icon: '🌍',
            implemented: false,
            showInNav: true,
          },
          {
            path: '/sports/association-football/events',
            title: 'Fixtures',
            description: 'Upcoming matches worth watching',
            icon: '📅',
            implemented: false,
            showInNav: true,
          },
        ],
      },
      {
        path: '/sports/basketball',
        title: 'Basketball',
        icon: '🏀',
        implemented: false,
        showInNav: true,
      },
      {
        path: '/sports/baseball',
        title: 'Baseball',
        icon: '⚾',
        implemented: false,
        showInNav: true,
      },
      {
        path: '/sports/cricket',
        title: 'Cricket',
        icon: '🏏',
        implemented: false,
        showInNav: true,
      },
      {
        path: '/sports/lacrosse',
        title: 'Lacrosse',
        icon: '🥍',
        implemented: false,
        showInNav: true,
      },
      {
        path: '/sports/formula1',
        title: 'Formula 1',
        icon: '🏎️',
        implemented: true,
        showInNav: true,
        children: [
          {
            path: '/sports/formula1/calendar',
            title: 'Calendar',
            description: 'F1 race calendar with excitement predictions',
            icon: '📅',
            implemented: true,
            showInNav: true,
          },
          {
            path: '/sports/formula1/standings',
            title: 'Standings',
            description: 'Driver and constructor championships',
            icon: '🏆',
            implemented: true,
            showInNav: true,
          },
          {
            path: '/sports/formula1/schedule',
            title: 'Sessions',
            description: 'Upcoming practice, qualifying, and races',
            icon: '⏱️',
            implemented: true,
            showInNav: true,
          },
        ],
      },
      {
        path: '/sports/cycling',
        title: 'Pro Cycling',
        icon: '🚴',
        implemented: true,
        showInNav: true,
        children: [
          {
            path: '/sports/cycling/races',
            title: 'Race Calendar',
            description: 'WorldTour and Pro Series races',
            icon: '📅',
            implemented: true,
            showInNav: true,
          },
          {
            path: '/sports/cycling/stages',
            title: 'Upcoming Stages',
            description: 'Grand Tour and stage race stages',
            icon: '⛰️',
            implemented: true,
            showInNav: true,
          },
          {
            path: '/sports/cycling/grand-tours',
            title: 'Grand Tours',
            description: 'Tour de France, Giro, Vuelta',
            icon: '🏆',
            implemented: false,
            showInNav: true,
          },
        ],
      },
    ],
  },
  {
    path: '/about',
    title: 'About',
    description: 'Learn about OTW.sport and our mission',
    icon: 'ℹ️',
    implemented: true,
    showInNav: true,
  },
  {
    path: '/how-it-works',
    title: 'How It Works',
    description: 'Understanding watchability scores and recommendations',
    icon: '❓',
    implemented: true,
    showInNav: true,
  },
  {
    path: '/profile',
    title: 'My Profile',
    description: 'Your OTW.sport profile and preferences',
    icon: '👤',
    implemented: true,
    showInNav: false, // Only accessible when logged in
  },
  {
    path: '/settings',
    title: 'Settings',
    description: 'Account and notification settings',
    icon: '⚙️',
    implemented: false,
    showInNav: false,
  },
  {
    path: '/nhl-standings',
    title: 'NHL 3-Point Standings',
    description: 'Explore NHL standings with the international 3-point system',
    icon: '🏒',
    implemented: true,
    showInNav: false,
  },
  {
    path: '/auth/callback',
    title: 'Authentication',
    description: 'OIDC authentication callback',
    icon: '🔐',
    implemented: true,
    showInNav: false,
  },
];

/**
 * Flatten sitemap into a single array for easy lookup
 */
export function flattenSitemap(routes: SitemapRoute[] = SITEMAP): SitemapRoute[] {
  const result: SitemapRoute[] = [];

  for (const route of routes) {
    result.push(route);
    if (route.children) {
      result.push(...flattenSitemap(route.children));
    }
  }

  return result;
}

/**
 * Find a route by path
 */
export function findRoute(path: string): SitemapRoute | undefined {
  return flattenSitemap().find((route) => route.path === path);
}

/**
 * Get breadcrumb trail for a given path
 */
export function getBreadcrumbs(path: string): SitemapRoute[] {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: SitemapRoute[] = [];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const route = findRoute(currentPath);
    if (route) {
      breadcrumbs.push(route);
    }
  }

  return breadcrumbs;
}

/**
 * Get navigation items for a specific level
 */
export function getNavItems(parentPath?: string): SitemapRoute[] {
  if (!parentPath) {
    return SITEMAP.filter((route) => route.showInNav);
  }

  const parent = findRoute(parentPath);
  return parent?.children?.filter((route) => route.showInNav) ?? [];
}

/**
 * Check if a route or any of its children are implemented
 */
export function hasImplementedContent(route: SitemapRoute): boolean {
  if (route.implemented) return true;
  return route.children?.some(hasImplementedContent) ?? false;
}
