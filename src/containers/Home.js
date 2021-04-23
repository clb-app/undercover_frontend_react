import { useHistory, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// import CSS
import "./Home.css";

// import des composants
import Header from "../components/Header";
import Button from "../components/Button";

const Home = ({ player, setReload }) => {
  const history = useHistory();
  const location = useLocation();

  // const [isAlreadyReloaded, setIsAlreadyReloaded] = useState(false);

  // useEffect(() => {
  //   console.log("useEffect from Home");
  //   setReload(true);
  // }, []);
  // document.addEventListener("loadend", () => {
  //   console.log("home loadend");
  // });
  // if (location.state === "reload" && !isAlreadyReloaded) {
  //   setIsAlreadyReloaded(true);
  // }

  const handlePlay = () => {
    history.push("/jouer");
  };

  const handleOptions = () => {
    history.push("/options");
  };

  const handleRules = () => {
    history.push("/regles");
  };

  return (
    <div className="Home">
      <Header title="Imposteur" />
      <div className="wrapper">
        <div className="Home-buttons-container">
          <Button
            title="Jouer"
            onClick={handlePlay}
            bgcColor="var(--blue)"
            width="150px"
          />
          <Button
            title="Options"
            onClick={handleOptions}
            bgcColor="var(--dark-blue)"
            width="150px"
          />
          <Button
            title="Règles"
            onClick={handleRules}
            bgcColor="var(--grey)"
            width="150px"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
