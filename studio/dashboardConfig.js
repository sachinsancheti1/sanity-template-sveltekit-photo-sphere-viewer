import {dashboardTool, projectUsersWidget, projectInfoWidget} from '@sanity/dashboard'
import {jokesWidget} from 'sanity-plugin-dashboard-dad-jokes'

export const dashboardConfig = dashboardTool({
  widgets: [jokesWidget(), projectInfoWidget(), projectUsersWidget({layout: {height: 'auto'}})],
})
