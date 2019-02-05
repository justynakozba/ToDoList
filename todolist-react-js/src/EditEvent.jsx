import React from "react";
import PropTypes from "prop-types";
import "./EditEvent.css";
import { isValidString } from "./utils";

const EditEvent = props => {
  const isFormValid =
    isValidString(props.name) && isValidString(props.deadline);
  const isFormEmpty = props.content === "" && props.deadline === "";

  return (
    <div className="header">
      <div className="edit-event">
        <h1>This is my ToDoList </h1>
        <div className="edit-event__input-group">
          <input
            type="text"
            id="content"
            name="content"
            value={props.content}
            onChange={e =>
              props.onInputChange({ [e.target.name]: e.target.value })
            }
            placeholder="Add task..."
          />
          <label htmlFor="content" />
        </div>
        <div className="edit-event__input-group">
          <input
            type="date"
            placeholder="Deadline..."
            id="deadline"
            name="deadline"
            value={props.deadline}
            onKeyPress={e => isValidString(e)}
            onChange={e =>
              props.onInputChange({ [e.target.name]: e.target.value })
            }
          />
          <label htmlFor="deadline" />
        </div>
        <div>
          <button disabled={!isFormValid} onClick={() => props.onSave()}>
            Add
          </button>
          <button disabled={isFormEmpty} onClick={() => props.onCancel()}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

EditEvent.propTypes = {
  content: PropTypes.string,
  deadline: PropTypes.string,
  onInputChange: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
};
export default EditEvent;
