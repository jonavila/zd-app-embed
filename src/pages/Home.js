import { Spinner } from '@blueprintjs/core';
import React, { createContext, useEffect, useState } from 'react';
import { Dashboard, NavigationBar } from '../components';
import { createClient, loadZoomdataSDK } from '../utils';
import styles from './Home.module.css';

export const ZoomdataClient = createContext(null);

export function Home() {
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
    <div className={styles.root}>
      {client ? (
        <ZoomdataClient.Provider value={client}>
          <NavigationBar />
          <div className={styles.mainContainer}>
            <Dashboard />
          </div>
        </ZoomdataClient.Provider>
      ) : (
        <Spinner className={styles.spinner} size={Spinner.SIZE_LARGE} />
      )}
    </div>
  );
}
