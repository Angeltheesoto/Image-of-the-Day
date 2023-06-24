import React, { useContext, useRef, useEffect, useState } from "react";
import Form from "../../components/form/Form";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import jwt_decode from "jwt-decode";

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const username = useRef();
  const password = useRef();
  const history = useNavigate();

  const [test, setTest] = useState();

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
  // !google login ---------------
  let handleCallbackResponse = (response) => {
    // console.log("User Object", jwt_decode(response.credential));
    setTest(jwt_decode(response.credential));
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "53373563171-7l1u4rq4g7dndfjpsnlaa5k0m5v4i903.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("googleSignIn"), {
      theme: "outline",
      size: "large",
    });
  }, []);
  // !google login ---------------

  console.log(test);
  return (
    <div>
      <Form handleSubmit={handleClick} submitText={"Log In"} title="Log In">
        <input type="text" placeholder="Username" ref={username} required />
        <input type="password" placeholder="Password" ref={password} required />
      </Form>
      <a href="#" className="loginForgot">
        Forgot Password
      </a>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <div id="googleSignIn"></div>
    </div>
  );
};

export default Login;
