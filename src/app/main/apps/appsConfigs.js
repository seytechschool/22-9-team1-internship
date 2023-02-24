import CalendarAppConfig from './calendar/CalendarAppConfig';
import ChatAppConfig from './chat/ChatAppConfig';
import ContactsAppConfig from './contacts/ContactsAppConfig';
import ProjectDashboardAppConfig from './dashboard/ProjectDashboardAppConfig';
import ContactsAppConfigD from './drivers/ContactsAppConfig';
import ContactsAppConfigI from './issues/ContactsAppConfig';
import MailAppConfig from './mail/MailAppConfig';

const appsConfigs = [
  ProjectDashboardAppConfig,
  MailAppConfig,
  ContactsAppConfig,
  CalendarAppConfig,
  ChatAppConfig,
  ContactsAppConfigD,
  ContactsAppConfigI
];

export default appsConfigs;
