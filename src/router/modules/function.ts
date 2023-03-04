const functionRoute: AuthRoute.Route = {
  name: 'function',
  path: '/function',
  component: 'basic',
  children: [
    {
      name: 'function_proxy-manage',
      path: '/function/proxy-manage',
      component: 'self',
      meta: {
        title: '代理管理',
        requiresAuth: true,
        icon: 'ic:round-tab'
      }
    }
  ],
  meta: {
    title: '功能',
    icon: 'icon-park-outline:all-application',
    order: 6
  }
};

export default functionRoute;
