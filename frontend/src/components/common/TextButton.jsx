import React from 'react';
import PropTypes from 'prop-types';

const buttonStyles = {
  start:
    'h-10 px-5 py-2 text-lg font-semibold text-white bg-[#7BA8EC] rounded hover:bg-[#6589BF]',
  content:
    'px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-200 rounded',
};

const TextButton = ({ type = 'start', onClick, children, className = '' }) => {
  return (
    <button onClick={onClick} className={`${buttonStyles[type]} ${className}`}>
      {children}
    </button>
  );
};

TextButton.propTypes = {
  type: PropTypes.oneOf(['start', 'content']),
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default TextButton;
