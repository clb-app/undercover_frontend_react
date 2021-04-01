import { useHistory, useLocation } from "react-router-dom";
import { useState } from "react";

// import CSS
import "./Home.css";

// import des composants
import Button from "../components/Button";

const Home = ({ player, setReload }) => {
  const history = useHistory();
  const location = useLocation();

  const [isAlreadyReloaded, setIsAlreadyReloaded] = useState(false);

  if (location.state === "reload" && !isAlreadyReloaded) {
    setReload(true);
    setIsAlreadyReloaded(true);
  }

  const handleNewParty = () => {
    history.push("/new");
  };

  const handleJoinParty = () => {
    history.push("/join");
  };

  return (
    <div className="Home">
      <h2 className="Home-title">
        Crées ou rejoins une partie et éclates toi avec tes potes sur Undercover
        !
      </h2>
      <div className="Home-buttons-container">
        <Button
          title="Tu veux créer une partie? C'est ici!"
          onClick={handleNewParty}
          width="400px"
        />
        <Button
          title="Tu veux rejoindre une partie? C'est ici!"
          onClick={handleJoinParty}
          width="400px"
        />
      </div>
    </div>
  );
};

export default Home;
