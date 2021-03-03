// import des packages
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

// import CSS
import "./App.css";

// import des containers
import Home from "./containers/Home";
import NewParty from "./containers/NewParty";
import JoinParty from "./containers/JoinParty";
import Party from "./containers/Party";

// import des composants
import Header from "./components/Header";
import Footer from "./components/Footer";

const api = "http://localhost:3001";

const App = () => {
  const [token, setToken] = useState(Cookies.get("token") || null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (token && !player) {
      (async () => {
        const response = await axios.get(`${api}/player`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setPlayer(response.data.player);
        }
      })();
    }
  }, []);

  const setPlayerToken = (t, p) => {
    setPlayer(p);
    Cookies.set("token", t);
    setToken(t);
  };

  console.log(player);

  return (
    <Router>
      <Header />
      <div className="wrapper">
        <Switch>
          <Route path="/new">
            <NewParty
              player={player}
              api={api}
              setPlayerToken={setPlayerToken}
            />
          </Route>
          <Route path="/join">
            <JoinParty
              player={player}
              api={api}
              setPlayerToken={setPlayerToken}
            />
          </Route>
          <Route path="/party/:code">
            <Party player={player} api={api} token={token} />
          </Route>
          <Route path="/">
            <Home player={player} />
          </Route>
        </Switch>
      </div>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;
