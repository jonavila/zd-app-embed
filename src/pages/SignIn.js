import { Redirect } from '@reach/router';
import qs from 'query-string';
import React from 'react';

export function SignIn() {
  const parsedLocation = qs.parse(window.location.hash);
  const { access_token: accessToken } = parsedLocation;

  if (accessToken) {
    if (window.opener) {
      if (window.opener.location.origin === window.location.origin) {
        window.opener.postMessage(
          {
            type: 'signIn',
            data: {
              accessToken: accessToken,
            },
          },
          window.location.origin,
        );
      }
    }
  }

  if (accessToken) {
    return <div>You are logged in!</div>;
  }

  return <Redirect noThrow to="login" />;
}
