import React from "react";
import PropTypes from "prop-types";
import "./Countdown.css";
import "./../node_modules/semantic-ui-css/semantic.css";

const Countdown = props => {
  return (
    <div className="countdown">
      <strong>{props.content}</strong> {props.deadline}
      <div className="countdown__icons">
        <i className="icon check" onClick={ () => props.onChecked(props.id)} />
        <i className="icon edit" onClick={() => props.onEditInit(props.id)} />
        <i className="icon times" onClick={() => props.onRemove(props.id)} />
      </div>
    </div>
  );
};
Countdown.propTypes = {
  name: PropTypes.string,
  content: PropTypes.string,
  deadline: PropTypes.data,
  onEditInit: PropTypes.func,
  onRemove: PropTypes.func,
  onChecked: PropTypes.func
};
export default Countdown;
