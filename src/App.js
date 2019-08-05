import { FocusStyleManager } from '@blueprintjs/core';
import { Redirect, Router } from '@reach/router';
import React, { createContext, useState } from 'react';
import './App.css';
import { PrivateRoute } from './components/private-route/PrivateRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SignIn } from './pages/SignIn';

FocusStyleManager.onlyShowFocusOnTabs();
export const ZoomdataAccessToken = createContext(null);

function App() {
  const [accessToken, setAccessToken] = useState(null);

  return (
    <ZoomdataAccessToken.Provider value={accessToken}>
      <Router>
        <PrivateRoute path="/">
          <Home path="home" />
        </PrivateRoute>
        <SignIn path="/signIn" />
        <Login path="login" setAccessToken={setAccessToken} />
        <Redirect noThrow from="/" to="home" />
      </Router>
    </ZoomdataAccessToken.Provider>
  );
}

export default App;
