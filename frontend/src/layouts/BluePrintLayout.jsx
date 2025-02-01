import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';

const BluePrintLayout = () => {

    return (
        <>
        <Header />
        <div className="flex">
            <div className="w-full h-screen pt-[48px] border border-black">drawing</div>
            <div className="min-w-[20rem] w-[20rem] h-screen pt-[48px] border border-black">sidebar</div>
        </div>
        <BackButton />
        </>
    );
};

export default BluePrintLayout;
