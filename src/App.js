// import des packages
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

// import CSS
import "./App.css";

// import des containers
import Home from "./containers/Home";
import LaunchParty from "./containers/LaunchParty";
import Options from "./containers/Options";
import NewParty from "./containers/NewParty";
import JoinParty from "./containers/JoinParty";
import Party from "./containers/Party";

// import des composants
import Footer from "./components/Footer";

// import des fonts
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";
library.add(faArrowLeft, faStar);

// const api = "http://localhost:3001"; // local
const api = "https://clb-undercover-nodejs.herokuapp.com"; // prod

const App = () => {
  const [token, setToken] = useState(Cookies.get("token") || null);
  const [player, setPlayer] = useState(null);
  const [reload, setReload] = useState(true);
  const [playersNumber, setPlayersNumber] = useState(4);
  const [timer, setTimer] = useState(3);
  const [roles, setRoles] = useState({ civils: 3, undercovers: 1, mrwhite: 0 });
  const [timerToPlay, setTimerToPlay] = useState(30);

  console.log(token);
  useEffect(() => {
    if (token && reload) {
      console.log("useEffect");
      setReload(false);
      (async () => {
        const response = await axios.get(`${api}/player?reload=true`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log(response.status);
          setPlayer(response.data.player);
        }
      })();
    } else {
      setReload(false);
    }
  }, [reload]);

  const setPlayerToken = (t, p) => {
    setPlayer(p);
    Cookies.set("token", t);
    setToken(t);
  };

  return (
    <Router>
      <Switch>
        <Route path="/jouer">
          <LaunchParty setReload={setReload} />
        </Route>
        <Route path="/options">
          <Options
            playersNumber={playersNumber}
            setPlayersNumber={setPlayersNumber}
            timer={timer}
            setTimer={setTimer}
            roles={roles}
            setRoles={setRoles}
            setReload={setReload}
            timerToPlay={timerToPlay}
            setTimerToPlay={setTimerToPlay}
          />
        </Route>
        <Route path="/creer">
          <NewParty
            player={player}
            api={api}
            setPlayerToken={setPlayerToken}
            playersNumber={playersNumber}
            timer={timer}
            roles={roles}
            timerToPlay={timerToPlay}
          />
        </Route>
        <Route path="/rejoindre">
          <JoinParty
            player={player}
            api={api}
            setPlayerToken={setPlayerToken}
          />
        </Route>
        <Route path="/partie/:code">
          <Party
            player={player}
            api={api}
            token={token}
            setPlayer={setPlayer}
            timer={timer}
            setReload={setReload}
          />
        </Route>
        <Route path="/">
          <Home player={player} setReload={setReload} />
        </Route>
      </Switch>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;
