import { useHistory } from "react-router-dom";

// import CSS
import "./Home.css";

// import des composants
import Button from "../components/Button";

const Home = ({ player }) => {
  const history = useHistory();

  const handleNewParty = () => {
    history.push("/new");
  };

  const handleJoinParty = () => {
    history.push("/join");
  };

  return (
    <div className="Home">
      <h2>Let's go</h2>
      <Button
        title="Tu veux créer une partie? C'est ici!"
        onClick={handleNewParty}
      />
      <Button
        title="Tu veux rejoindre une partie? C'est ici!"
        onClick={handleJoinParty}
      />
    </div>
  );
};

export default Home;
