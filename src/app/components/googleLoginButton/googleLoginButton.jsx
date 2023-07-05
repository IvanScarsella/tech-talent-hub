"use client";
import { google } from "../../public/assets/imagesCodes";
import Image from "next/image";
import styles from "./googleLoginButton.module.css";
import { app } from "@/src/firebase/firebase.config";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

const auth = getAuth(app);
export async function loggingGoogle(setGoogleData) {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    setGoogleData(user);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  }
}

export function GoogleLoginButton({ pathname, setGoogleData, isDisabled }) {
  const textButton =
    pathname.includes("signupusers") || pathname.includes("signupcompanies")
      ? "Join with"
      : "Login with";
  return (
    <button
      className={isDisabled ? styles.ButtonD : styles.ButtonB}
      onClick={() => loggingGoogle(setGoogleData)}
      disabled={isDisabled}
    >
      {textButton}&nbsp;<span className={styles.GoogleText}>Google</span>
    </button>
  );
}
