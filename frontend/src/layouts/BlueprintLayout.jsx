import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import Icon from '../components/common/Icon';
import { useRecoilState } from 'recoil';
import { modalState } from '../recoil/common/modal';

const BlueprintLayout = ({ children, setIsTutorial }) => {
  const [modal, setModal] = useRecoilState(modalState);

  const handleViewTutorial = () => {
    setIsTutorial(true);
    setModal(null);
  };

  return (
    <>
      <Header />
      {children}
      <BackButton />
      <div className="fixed bottom-4 left-18 z-50 animate-bounce">
        <button
          onClick={(e) => {
            e.currentTarget.parentElement.classList.remove('animate-bounce');
            handleViewTutorial();
          }}
          className="relative flex items-center justify-center w-12 h-12 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full transition-opacity cursor-pointer"
        >
          <Icon name="IconTutorial" />
        </button>
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          튜토리얼 보기
        </div>
      </div>
    </>
  );
};

export default BlueprintLayout;
