import React from "react";
import "./form.css";

const Form = ({ handleSubmit, title, submitText, children }) => {
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>{title}</h2>
        {children}
        <button className="form-btn" type="submit">
          {submitText}
        </button>
      </form>
    </div>
  );
};

export default Form;
