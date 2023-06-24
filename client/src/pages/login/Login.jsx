import React, { useContext, useRef } from "react";
import Form from "../../components/form/Form";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const username = useRef();
  const password = useRef();
  const history = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", {
        username: username.current.value,
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
  };

  return (
    <div>
      <Form handleSubmit={handleClick} submitText={"Log In"} title="Log In">
        <input type="text" placeholder="Username" ref={username} required />
        <input type="password" placeholder="Password" ref={password} required />
      </Form>
      <span className="loginForgot">Forgot Password?</span>
      <Link to="/register">Register</Link>
    </div>
  );
};

export default Login;
