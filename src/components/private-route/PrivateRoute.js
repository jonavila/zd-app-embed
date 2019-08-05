import { Redirect } from '@reach/router';
import React, { useContext } from 'react';
import { ZoomdataAccessToken } from '../../App';

export function PrivateRoute(props) {
  const { children } = props;
  const accessToken = useContext(ZoomdataAccessToken);

  if (accessToken) {
    return <>{children}</>;
  }

  sessionStorage.setItem('from', JSON.stringify(window.location.pathname));

  return <Redirect noThrow to="login" />;
}
