import React, { useCallback, useEffect, useMemo } from 'react';

import { AppConfig, AuthOptions, UserSession } from '@stacks/connect';
import { AppState, defaultState } from './context';

export interface AuthOptionsArgs {
  manifestPath?: string;
  redirectTo?: string;
  appDetails?: {
    name?: string;
    icon?: string;
  };
}

export function useAuth(customAuthOptions?: AuthOptionsArgs) {
  const [state, setState] = React.useState<AppState>(defaultState());
  const [authResponse, setAuthResponse] = React.useState('');
  const [appPrivateKey, setAppPrivateKey] = React.useState('');

  const appConfig = useMemo(
    () => new AppConfig(['store_write', 'publish_data'], process.env.NEXT_PUBLIC_DOMAIN),
    []
  );
  const userSession = useMemo(() => new UserSession({ appConfig }), [appConfig]);

  const handleSignOut = useCallback(() => {
    userSession.signUserOut();
    setState({ userData: null });
  }, [userSession]);

  const handleRedirectAuth = useCallback(async () => {
    if (userSession.isSignInPending()) {
      const userData = await userSession.handlePendingSignIn();
      setState({ userData });
      setAppPrivateKey(userData.appPrivateKey);
    } else if (userSession.isUserSignedIn()) {
      setAppPrivateKey(userSession.loadUserData().appPrivateKey);
    }
  }, [userSession]);

  const onFinish = useCallback(
    ({ userSession, authResponse }: { userSession: any; authResponse: any }) => {
      const userData = userSession.loadUserData();
      setAppPrivateKey(userSession.loadUserData().appPrivateKey);
      setAuthResponse(authResponse);
      setState({ userData });
    },
    []
  );

  const onCancel = useCallback(() => {
    console.log('popup closed!');
  }, []);

  useEffect(() => {
    void handleRedirectAuth();
    if (userSession.isUserSignedIn() && !state.userData) {
      const userData = userSession.loadUserData();
      setState({ userData });
    }
  }, [handleRedirectAuth, userSession, state]);

  const authOptions: AuthOptions = {
    manifestPath: customAuthOptions?.manifestPath || '/manifest.json',
    redirectTo: customAuthOptions?.redirectTo || '/',
    userSession,
    onFinish,
    onCancel,
    appDetails: {
      name: 'Catamaran Swaps',
      icon: 'https://catamaranswaps.org/android-icon-192x192.png',
    },
  };
  return {
    authOptions,
    state,
    authResponse,
    appPrivateKey,
    handleSignOut,
  };
}
