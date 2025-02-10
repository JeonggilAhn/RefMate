import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImgB2NoteList from '../../assets/images/ImgB2NoteList.svg';
import ImgB2NoteTitle from '../../assets/images/ImgB2NoteTitle.svg';
import ImgB2ImageNote from '../../assets/images/ImgB2ImageNote.svg';

const Button2 = () => {
  const [step, setStep] = useState(0); // 0: 초기, 1: 리스트, 2: 타이틀, 3: 이미지, 4: 초기화

  useEffect(() => {
    const interval = setInterval(
      () => {
        setStep((prevStep) => (prevStep === 4 ? 0 : prevStep + 1));
      },
      step === 3 ? 3000 : 1000,
    ); // 이미지가 나타난 상태(3단계)에서는 3초 대기, 나머지는 1초 간격
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="relative w-full h-full bg-white border border-gray-300 rounded-md overflow-hidden p-4">
      <AnimatePresence>
        {/* 리스트 이미지 */}
        {step >= 1 && (
          <motion.div
            className="absolute"
            style={{
              top: '1rem',
              left: '7rem',
              width: '40%',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1, // 등장 시 서서히 나타남
              exit: { duration: 0 }, // 사라질 때 한 번에 사라짐
            }}
          >
            <img
              src={ImgB2NoteList}
              alt="Note List"
              className="w-95% h-auto object-contain"
            />
          </motion.div>
        )}

        {/* 타이틀 이미지 */}
        {step >= 2 && (
          <motion.div
            className="absolute"
            style={{
              top: '23rem',
              left: '7rem',
              width: '40%',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1, // 등장 시 서서히 나타남
              exit: { duration: 0 }, // 사라질 때 한 번에 사라짐
            }}
          >
            <img
              src={ImgB2NoteTitle}
              alt="Note Title"
              className="w-95% h-auto object-contain"
            />
          </motion.div>
        )}

        {/* 이미지 노트 */}
        {step >= 3 && (
          <motion.div
            className="absolute"
            style={{
              top: '3rem',
              right: '5rem',
              width: '40%',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1, // 등장 시 서서히 나타남
              exit: { duration: 0 }, // 사라질 때 한 번에 사라짐
            }}
          >
            <img
              src={ImgB2ImageNote}
              alt="Image Note"
              className="w-95% h-auto object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Button2;
