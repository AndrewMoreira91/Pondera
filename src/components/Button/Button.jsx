/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import './Button.css';
import { useState } from 'react';

function Button({ backgroundColor, textColor, onClick, children }) {

  const [bgColor, setbgColor] = useState(null)
  if (backgroundColor && !bgColor) {
    setbgColor(backgroundColor)
  } else if (!bgColor) {
    setbgColor("rgba(146, 146, 146, 0.15)")
  }

  const [txtColor, setTxtColor] = useState(null)
  if (textColor && !txtColor) {
    setTxtColor(textColor)
  } else if (!txtColor) {
    setTxtColor("#EDEDED")
  }

  return (
    <button style={ { backgroundColor: bgColor, color: txtColor } } onClick={onClick} className='button-component'>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Button;