export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/login',
        component: './login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        // authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: './system',
            name: 'system',
            icon: 'setting',
            routes: [
              {
                path: '/system/menu',
                name: 'menu',
                icon: 'solution',
                component: './menu',
              },
              {
                path: '/system/role',
                name: 'menu',
                icon: 'audit',
                component: './role',
              },
              {
                path: '/system/user',
                name: 'user',
                icon: 'user',
                component: './user',
              },
            ],
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
