import CalendarAppConfig from './calendar/CalendarAppConfig';
import ChatAppConfig from './chat/ChatAppConfig';
import ContactsAppConfig from './contacts/ContactsAppConfig';
import ProjectDashboardAppConfig from './dashboard/ProjectDashboardAppConfig';
import ContactsAppConfigD from './drivers/ContactsAppConfig';
import MailAppConfig from './mail/MailAppConfig';

const appsConfigs = [
  ProjectDashboardAppConfig,
  MailAppConfig,
  ContactsAppConfig,
  CalendarAppConfig,
  ChatAppConfig,
  ContactsAppConfigD
];

export default appsConfigs;
