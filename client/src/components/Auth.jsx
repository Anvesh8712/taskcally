import React, { useState } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("user signed in with Google: ", result.user);
      })
      .catch((error) => {
        console.error("Error signing in with Google: ", error);
      });
  };

  const handleEmailSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(
          "user signed in with email and password: ",
          userCredential.user
        );
      })
      .catch((error) => {
        console.error("Error signing in with email and password: ", error);
      });
  };

  const handleEmailSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User signed up with email: ", userCredential.user);
      })
      .catch((error) => {
        console.error("Error signing up with email: ", error);
      });
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleEmailSignIn}>Sign In</button>
      <button onClick={handleEmailSignUp}>Sign Up</button>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default Auth;
