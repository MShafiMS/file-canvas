import { Layout } from '@enums';
import { DrawingsModule } from '@modules/Drawings';

const Drawings = () => {
  return <DrawingsModule />;
};
Drawings.layout = Layout.SIDEBAR;
export default Drawings;
