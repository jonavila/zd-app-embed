import { Spinner } from '@blueprintjs/core';
import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import { Dashboard, NavigationBar } from './components';
import { createClient, loadZoomdataSDK } from './utils';

export const ZoomdataClient = createContext(null);

function App() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    async function initApp() {
      try {
        await loadZoomdataSDK();
        setClient(await createClient());
      } catch (error) {
        console.error(error);
      }
    }

    initApp();
  }, []);

  return (
    <div className="app">
      {client ? (
        <ZoomdataClient.Provider value={client}>
          <NavigationBar />
          <div className="main-container">
            <Dashboard />
          </div>
        </ZoomdataClient.Provider>
      ) : (
        <Spinner className="spinner" size={Spinner.SIZE_LARGE} />
      )}
    </div>
  );
}

export default App;
