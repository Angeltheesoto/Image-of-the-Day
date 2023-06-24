import React, { useContext, useEffect, useRef, useState } from "react";
import Form from "../../components/form/Form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Register = () => {
  const { user, setUser } = useContext(UserContext);
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (password.current.value === passwordAgain.current.value) {
      try {
        const response = await axios.post("/api/auth/register", {
          username: username.current.value,
          email: email.current.value,
          password: password.current.value,
        });

        if (response.status === 200) {
          console.log("Logged in successfully!", response.data.token);
          const token = response.data.token;
          setUser({ token: token });
          history("/");
        }
      } catch (err) {
        console.log("Error during login: ", err);
      }
    } else {
      alert("Passwords do not match!");
    }
  };

  return (
    <div>
      <Form handleSubmit={handleClick} submitText={"Log In"} title="Register">
        <input type="text" placeholder="Username" ref={username} required />
        <input type="email" placeholder="Email" ref={email} required />
        <input type="password" placeholder="Password" ref={password} required />
        <input
          type="password"
          placeholder="Confirm Password"
          ref={passwordAgain}
          required
        />
      </Form>
      <p>
        Have an account? <Link to="/login">LogIn</Link>
      </p>
      <div id="googleSignIn"></div>
    </div>
  );
};

export default Register;
