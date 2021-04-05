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
import NewParty from "./containers/NewParty";
import JoinParty from "./containers/JoinParty";
import Party from "./containers/Party";

// import des composants
import Footer from "./components/Footer";

// const api = "http://localhost:3001"; // local
const api = "https://clb-undercover-nodejs.herokuapp.com"; // prod

const App = () => {
  const [token, setToken] = useState(Cookies.get("token") || null);
  const [player, setPlayer] = useState(null);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    if (token && reload) {
      console.log("useEffect");
      (async () => {
        const response = await axios.get(`${api}/player?reload=true`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setPlayer(response.data.player);
          setReload(false);
        }
      })();
    }
  }, [reload]);

  const setPlayerToken = (t, p) => {
    setPlayer(p);
    Cookies.set("token", t);
    setToken(t);
  };

  console.log(player);

  return (
    <Router>
      <Switch>
        <Route path="/jouer">
          <LaunchParty />
        </Route>
        <Route path="/new">
          <NewParty player={player} api={api} setPlayerToken={setPlayerToken} />
        </Route>
        <Route path="/rejoindre">
          <JoinParty
            player={player}
            api={api}
            setPlayerToken={setPlayerToken}
          />
        </Route>
        <Route path="/party/:code">
          <Party
            player={player}
            api={api}
            token={token}
            setPlayer={setPlayer}
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
