import './App.css';
import { Component } from 'react'
import Login from "./Login/Login"
import Settings from "./Settings/Settings"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

class App extends Component {
  state = {
    show: "Login"
  }
  render() {
    return (
      <div className="App">
        <div className="app-title">AIPM Admin Console</div>
        <div className="operations-container">
          <Router>
            <Route path="/login" component={Login} />
            <Route path="/settings" component={Settings} />
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
