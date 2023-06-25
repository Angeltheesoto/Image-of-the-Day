import "bootstrap/dist/css/bootstrap.min.css";
import "./index";
import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/nav/Nav";
import Footer from "./components/footer/Footer";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register.jsx";
import Home from "./pages/home/Home";
import { UserContext } from "./context/UserContext";

function App() {
  const { user, setUser } = useContext(UserContext);

  return (
    <React.Fragment>
      <BrowserRouter>
        <Nav />
        <div className="app-container">
          <Routes>
            <Route path="/" element={user ? <Home /> : <Register />} />
            <Route path="/login" element={user ? <Home /> : <Login />} />
            <Route path="/register" element={user ? <Home /> : <Register />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
