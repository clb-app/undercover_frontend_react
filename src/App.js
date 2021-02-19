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
  const [user, setUser] = useState(null);

  console.log(token);

  useEffect(() => {
    if (token) {
      console.log("if");
      (async () => {
        const response = await axios.get(`${api}/player`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        console.log(response);
        if (response.status === 200) {
          setUser(response.data);
        }
      })();
    }
  }, []);

  const setNewUser = async (nickname, page) => {
    const token = uid2(16);
    Cookies.set("token", token);
    setToken(token);

    try {
      const response = await axios.post(`${api}/player/new`, {
        nickname,
        token,
      });

      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(user);

  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/new">
          <NewParty user={user} />
        </Route>
        <Route path="/join">
          <JoinParty user={user} />
        </Route>
        <Route path="/party/:code">
          <Party />
        </Route>
        <Route path="/">
          <Home setNewUser={setNewUser} token={token} user={user} />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
