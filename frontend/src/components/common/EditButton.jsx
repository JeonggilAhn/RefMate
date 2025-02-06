import React, { useState, useRef, useEffect } from 'react';
import { MdMoreHoriz } from 'react-icons/md';
import styled from 'styled-components';

const EditButton = ({ actions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  const toggleModal = () => setIsOpen((prev) => !prev);

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
          {actions.map((action, index) => (
            <ModalButton
              key={index}
              onClick={() => {
                action.handler();
                setIsOpen(false);
              }}
            >
              {action.name}
            </ModalButton>
          ))}
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
  width: 6rem;
  z-index: 10;
`;

const ModalButton = styled.button`
  cursor: pointer;
  width: 100%;
  border: none;
  background: none;
  padding: 5px;
  text-align: left;
  &:hover {
    background: #f0f0f0;
  }
`;

export default EditButton;
