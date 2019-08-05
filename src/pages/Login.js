import { AnchorButton, Classes } from '@blueprintjs/core';
import { Redirect } from '@reach/router';
import React, { useCallback, useContext } from 'react';
import { ZoomdataAccessToken } from '../App';
import logo from '../assets/zoomdata-logo-charcoal.svg';
import { credentials } from '../config/zoomdata';
import { authorizeUser } from '../utils';
import styles from './Login.module.css';

function RedirectToPage() {
  if (sessionStorage.getItem('from')) {
    const from = JSON.parse(sessionStorage.getItem('from'));
    sessionStorage.removeItem('from');

    return <Redirect noThrow to={from} />;
  }

  return <Redirect noThrow to="home" />;
}

export function Login(props) {
  const accessToken = useContext(ZoomdataAccessToken);
  const { setAccessToken } = props;
  const handleLogin = useCallback(async () => {
    const extractedToken = await authorizeUser();
    credentials.access_token = extractedToken;
    console.log(extractedToken);
    setAccessToken(extractedToken);
  }, [setAccessToken]);

  if (accessToken) {
    return RedirectToPage();
  }

  return (
    <div className={styles.root}>
      <img alt="Zoomdata Logo" className={styles.logo} src={logo} />
      <h3 className={Classes.HEADING}>Embed Example</h3>
      <AnchorButton intent={'primary'} large onClick={handleLogin} text="Log-In" />
    </div>
  );
}
