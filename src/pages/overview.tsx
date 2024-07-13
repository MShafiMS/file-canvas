import { Layout } from '@enums';
import { DashboardModule } from '@modules/Dashboard';

const Overview = () => {
  return <DashboardModule />;
};

Overview.layout = Layout.SIDEBAR;
export default Overview;
