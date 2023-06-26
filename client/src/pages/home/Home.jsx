import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import Container from "react-bootstrap/esm/Container";
import Spinner from "react-bootstrap/Spinner";

const Home = () => {
  const { user, setUser, username, setUsername } = useContext(UserContext);
  const [photo, setPhoto] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  var config = {
    headers: {
      authorization: `Bearer ${user.token}`,
    },
  };

  useEffect(() => {
    // !Fetch username ------
    const fetchData = async (req, res) => {
      try {
        let response = await axios.get(
          "https://image-of-the-day.vercel.app/api/secure-route",
          config
        );
        setUsername(response.data.user.username);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    // !Fetch images from NASA ------
    let fetchPhoto = async () => {
      const year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      if (month.toString().length < 2) {
        month = "0" + month;
      }
      const day = new Date().getDate();
      let today = `${year}-${month}-${day}`;
      try {
        setIsFetching(true);
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?date=${today}&api_key=ZPlzGHvEwjFIZxn0nJcC1l4dzEtk3dBz6Br3FaPC`
        );
        const json = await response.json();
        setPhoto(json);
        setIsFetching(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPhoto();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="home-title mb-4">Image of the Day</h1>
      <div className="home-photo-container">
        <a href="https://www.nasa.gov/" target="_blank">
          {isFetching ? (
            <Spinner animation="border" className="home-spinner" />
          ) : (
            <img
              src={photo ? photo.url : null}
              alt="nasa photo"
              className="home-photo"
            />
          )}
        </a>
      </div>
    </Container>
  );
};

export default Home;
