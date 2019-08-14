import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import './App.css';

import Home from './Pages/Home';
import Login from './Pages/Login';

import UserContext, {UserContextProvider} from './Contexts/UserContext';

function App() {

  return (
    <Router>
      <div className="App">
        <UserContextProvider>
          <UserContext.Consumer>
            {context => {
              if (context.isLoading) {
                return <div>Loading...</div>;
              }
              
              return (
                <Switch>
                  <Route path="/login" component={Login} />
                  <Route path="/" render={() => {
                    if (!context.user) {
                      return <Redirect to="login" />;
                    } else {
                      return <Home />;
                    }
                  }} />
                </Switch>
              );
            }}
          </UserContext.Consumer>
        </UserContextProvider>
      </div>
    </Router>
  );
}

export default App;
