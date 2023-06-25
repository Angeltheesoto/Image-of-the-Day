import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./nav.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const Nav = () => {
  const { user, setUser, username, setUsername } = useContext(UserContext);
  const history = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    setUser(null);
    setUsername(null);
    history("/");
  };

  return (
    <Navbar className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#" className="logo">
          IOTD
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {user ? (
              <div className="nav-right">
                <div className="d-flex">
                  <p className="nav-user me-3">
                    Signed in as:{" "}
                    <span className="nav-username">{username}</span>
                  </p>
                </div>
                <button onClick={handleLogout} className="nav-logout">
                  Log Out
                </button>
              </div>
            ) : null}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Nav;
