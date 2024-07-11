import { Layout } from '@enums';
import { FilesModule } from '@modules/Files';

const Files = () => {
  return <FilesModule />;
};

Files.layout = Layout.SIDEBAR;
export default Files;
