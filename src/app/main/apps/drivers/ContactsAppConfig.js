import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const ContactsAppConfigD = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/apps/drivers/:id',
      component: lazy(() => import('./ContactsApp'))
    },
    {
      path: '/apps/vehicles',
      component: () => <Redirect to="/apps/drivers/all" />
    }
  ]
};

export default ContactsAppConfigD;
