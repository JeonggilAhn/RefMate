import React, { useState, useRef, useEffect } from 'react';
import { MdMoreHoriz } from 'react-icons/md';
import styled from 'styled-components';

const EditButton = ({ showDelete = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  const toggleModal = () => setIsOpen(!isOpen);

  // 모달 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Container>
      <EditIcon onClick={toggleModal} />
      {isOpen && (
        <Modal ref={modalRef}>
          <ModalButton onClick={() => alert('추후에 수정하기 팝업')}>
            수정하기
          </ModalButton>
          {showDelete && (
            <ModalButton onClick={() => alert('추후에 삭제하기 팝업')}>
              삭제하기
            </ModalButton>
          )}
        </Modal>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: block;
`;

const EditIcon = styled(MdMoreHoriz)`
  cursor: pointer;
  font-size: 0.8rem;
  color: #888;
  &:hover {
    color: #7ba8ec;
  }
`;

const Modal = styled.div`
  position: absolute;
  background: white;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  width: 5rem;
  z-index: 10;
`;

const ModalButton = styled.button`
  cursor: pointer;
  width: 100%;
  border-bottom: 1px solid black;

  &:last-child {
    border-bottom: none;
  }
`;

export default EditButton;
