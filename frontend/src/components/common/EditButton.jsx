import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Icon from './Icon';

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
      <Icon onClick={toggleModal} name="IconPiDotsThree"></Icon>
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
  z-index: 10;
`;

const Modal = styled.div`
  left: 100%;
  position: absolute;
  background: white;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  width: 4rem;
  z-index: 5;
  top: 0;
`;

const ModalButton = styled.button`
  cursor: pointer;
  width: 100%;
  border: none;
  background: none;
  padding: 5px;

  &:hover {
    background: #f0f0f0;
  }
`;

export default EditButton;
