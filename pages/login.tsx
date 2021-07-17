import Head from "next/head";
import React from "react";
import { Button } from "@material-ui/core";

import { LoginBox } from "../components/styled/LoginBox";
import { LoginContainer } from "../components/styled/LoginContainer";
import { Logo } from "../components/styled/Logo";
import { auth, provider } from "../utils/firebase";

export default function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <LoginContainer>
      <Head>
        <title>Login</title>
      </Head>

      <LoginBox>
        <Logo src="https://i.imgur.com/Kwhqqqn.png" />
        <Button variant="outlined" onClick={signIn}>
          Sign In With Google
        </Button>
      </LoginBox>
    </LoginContainer>
  );
}
