import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const ContactsAppConfigI = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/apps/issues/:id',
      component: lazy(() => import('./ContactsApp'))
    },
    {
      path: '/apps/vehicles',
      component: () => <Redirect to="/apps/issues/all" />
    }
  ]
};

export default ContactsAppConfigI;
