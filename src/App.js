// import des packages
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

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

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/new">
          <NewParty />
        </Route>
        <Route path="/join">
          <JoinParty />
        </Route>
        <Route path="/party/:code">
          <Party />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
