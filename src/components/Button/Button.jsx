import PropTypes from 'prop-types';
import './Button.css';

function Button(props) {
  return (
    <button onClick={props.onClick} className='button-component'>
      {props.children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Button;