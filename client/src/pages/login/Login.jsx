import React, { useContext, useRef, useEffect } from "react";
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
  let handleCallbackResponse = async (response) => {
    // console.log("User Object", jwt_decode(response.credential));
    const decodedToken = jwt_decode(response.credential);
    const name = decodedToken.email;
    const newUserName = name.split("@")[0];
    const googleUser = {
      username: newUserName,
      email: decodedToken.email,
      password: "123456",
      profilePicture: decodedToken.picture,
    };
    try {
      try {
        var isUser = await axios.get(`/api/users/${googleUser.username}`);
      } catch (err) {
        console.log("Error checking user exists: ", err);
      }
      // !This checks if a user exists then just log them in else create an account and log them in.
      if (isUser) {
        var registerResponse = await axios.post("/api/auth/login", {
          username: googleUser.username,
          password: googleUser.password,
        });
      } else {
        var registerResponse = await axios.post("/api/auth/register", {
          username: googleUser.username,
          email: googleUser.email,
          password: googleUser.password,
          profilePicture: googleUser.profilePicture,
        });
      }

      if (registerResponse.status === 200) {
        console.log("Logged in successfully!", registerResponse.data.token);
        const token = registerResponse.data.token;
        setUser({ token: token });
        history("/");
      }
    } catch (err) {
      console.log("Error during login: ", err);
    }
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

  return (
    <div className="login-container">
      <Form handleSubmit={handleClick} submitText={"Log In"} title="Log In">
        <input type="text" placeholder="Username" ref={username} required />
        <input type="password" placeholder="Password" ref={password} required />
      </Form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <p>Or</p>
      <div id="googleSignIn"></div>
    </div>
  );
};

export default Login;
