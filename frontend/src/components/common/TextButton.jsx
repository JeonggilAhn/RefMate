import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const TextButton = ({
  type = 'start',
  isSelected = false,
  onClick,
  children,
}) => {
  return (
    <StyledButton type={type} isSelected={isSelected} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

TextButton.propTypes = {
  type: PropTypes.oneOf(['start', 'content']),
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
  white-space: nowrap;

  ${(props) =>
    props.type === 'start' &&
    css`
      background-color: ${props.isSelected ? '#6589BF' : '#7BA8EC'};
      color: white;
      border: none;
      &:hover {
        background-color: #6589bf;
      }
    `}

  ${(props) =>
    props.type === 'content' &&
    css`
      background-color: ${props.isSelected ? '#D9D9D9' : '#FFFFFF'};
      color: ${props.isSelected ? '#111827' : '#374151'};
      border: 1px solid ${props.isSelected ? '#A3A3A3' : '#D1D5DB'};
      &:hover {
        background-color: #d9d9d9;
      }
    `}
`;

export default TextButton;
