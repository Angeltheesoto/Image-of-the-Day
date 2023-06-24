import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const history = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    setUser(null);
    history("/");
  };

  return (
    <div>
      Navbar
      {user ? <button onClick={handleLogout}>Log Out</button> : null}
    </div>
  );
};

export default Navbar;
