// import des packages
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Cookies from "js-cookie";
import uid2 from "uid2";
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
    if (token) {
      (async () => {
        const response = await axios.get(`${api}/player`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setPlayer(response.data);
        }
      })();
    }
  }, []);

  const setPlayerToken = (t) => {
    Cookies.set("token", t);
  };

  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/new">
          <NewParty player={player} />
        </Route>
        <Route path="/join">
          <JoinParty player={player} />
        </Route>
        <Route path="/party/:code">
          <Party />
        </Route>
        <Route path="/">
          <Home player={player} />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
