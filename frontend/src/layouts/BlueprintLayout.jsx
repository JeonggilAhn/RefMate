import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';

const BlueprintLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <BackButton />
    </>
  );
};

export default BlueprintLayout;
