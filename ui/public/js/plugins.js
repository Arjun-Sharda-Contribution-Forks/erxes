window.plugins = [
  {
    name: 'automations',
    port: 3008,
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url: 'http://localhost:3008/remoteEntry.js',
      scope: 'automations',
      module: './routes'
    },
    menus: [
      {
        text: 'Automations',
        url: '/automations',
        icon: 'icon-circular',
        location: 'mainNavigation'
      }
    ]
  },
  {
    name: 'bookings',
    port: 3002,
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url: 'http://localhost:3002/remoteEntry.js',
      scope: 'bookings',
      module: './routes'
    },
    menus: [
      {
        text: 'Bookings',
        url: '/bookings',
        icon: 'icon-paste',
        location: 'mainNavigation'
      }
    ]
  },
  {
    name: 'calendar',
    port: 3006,
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url: 'http://localhost:3006/remoteEntry.js',
      scope: 'calendar',
      module: './routes'
    },
    menus: [
      {
        text: 'Calendar',
        url: '/calendar',
        icon: 'icon-calendar-alt',
        location: 'mainNavigation'
      }
    ]
  },
  {
    name: 'deals',
    port: 3003,
    exposes: {
      './routes': './src/routes.tsx',
      './settings': './src/Settings.tsx'
    },
    routes: {
      url: 'http://localhost:3003/remoteEntry.js',
      scope: 'deals',
      module: './routes'
    },
    menus: [
      {
        text: 'Growth Hacking',
        url: '/growthHack',
        icon: 'icon-idea',
        location: 'mainNavigation'
      }
    ]
  },
  {
    name: 'contacts',
    port: 3011,
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url: 'http://localhost:3011/remoteEntry.js',
      scope: 'contacts',
      module: './routes'
    },
    menus: [
      {
        text: 'Contacts',
        url: '/contacts/customer',
        icon: 'icon-users',
        location: 'mainNavigation'
      }
    ]
  },
  {
    name: 'engages',
    port: 3001,
    exposes: {
      './routes': './src/routes.tsx',
      './settings': './src/Settings.tsx'
    },
    routes: {
      url: 'http://localhost:3001/remoteEntry.js',
      scope: 'engages',
      module: './routes'
    },
    menus: [
      {
        text: 'Campaigns',
        url: '/campaigns',
        icon: 'icon-megaphone',
        location: 'mainNavigation'
      },
      {
        text: 'Campaigns settings',
        icon: 'icon-megaphone',
        location: 'settings',
        scope: 'engages',
        component: './settings'
      }
    ]
  },
  {
    name: 'forms',
    port: 3005,
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url: 'http://localhost:3005/remoteEntry.js',
      scope: 'forms',
      module: './routes'
    },
    menus: [
      {
        text: 'Forms',
        url: '/forms',
        icon: 'icon-laptop',
        location: 'mainNavigation'
      }
    ]
  },
  {
    name: 'knowledgeBase',
    port: 3004,
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url: 'http://localhost:3004/remoteEntry.js',
      scope: 'knowledgeBase',
      module: './routes'
    },
    menus: [
      {
        text: 'Knowledge Base',
        url: '/knowledgeBase',
        icon: 'icon-book-open',
        location: 'mainNavigation'
      }
    ]
  },
  {
    name: 'dashboard',
    port: 3007,
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url: 'http://localhost:3007/remoteEntry.js',
      scope: 'dashboard',
      module: './routes'
    },
    menus: [
      {
        text: 'Dashboard',
        url: '/dashboard',
        icon: 'icon-dashboard',
        location: 'mainNavigation'
      }
    ]
  },
  {
    name: 'team',
    port: 3010,
    exposes: { './routes': './src/routes.tsx' },
    routes: {
      url: 'http://localhost:3010/remoteEntry.js',
      scope: 'team',
      module: './routes'
    },
    menus: [
      {
        text: 'Team',
        url: '/team',
        icon: 'icon-integration',
        location: 'mainNavigation'
      }
    ]
  }
];
