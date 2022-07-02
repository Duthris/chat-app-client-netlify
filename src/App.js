import React from 'react';
import Home from './pages/Home';
import Chat from './pages/Chat';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/room=:roomName/user=:userName" component={Chat} />
      </Switch>
    </Router>
  );
}

export default App;
