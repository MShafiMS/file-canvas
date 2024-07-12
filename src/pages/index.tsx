import { Layout } from '@enums';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home = () => {
  const { push } = useRouter();
  useEffect(() => {
    push('/drawings');
  }, []);
  return <div>Hello world</div>;
};

Home.layout = Layout.SIDEBAR;
export default Home;
