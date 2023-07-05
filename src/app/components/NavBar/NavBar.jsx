"use client";
import React, { useState } from "react";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  home,
  logoff,
  dashboard,
  about,
  myprofile,
  posts,
  loginusername,
  logingroup,
} from "../../public/assets/imagesCodes";
import styles from "./NavBar.module.css";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const [isProfile, setIsProfile] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [isPreLogIn, setIsPreLogIn] = useState(false);

  //? ROUTER
  const router = usePathname();
  const routerb = useRouter();

  //? FUNCTION LOGOUT
  function logOut() {
    localStorage.removeItem("userData");
    routerb.push("/landing");
  }

  //? USE EFFECT ROUTER
  useEffect(() => {
    if (router.includes("profile")) {
      setIsProfile(true);
      setIsCompany(false);
      setIsPreLogIn(false);
    } else if (router.includes("company")) {
      setIsProfile(false);
      setIsCompany(true);
      setIsPreLogIn(false);
    } else {
      setIsProfile(false);
      setIsCompany(false);
      setIsPreLogIn(true);
    }
  }, [router]);

  if (isProfile) {
    return (
      <div className={styles.Navbar}>
        <div className={styles.IconsContainer}>
          <Link href="/profile/dashboard">
            <Image
              src={dashboard}
              alt="image"
              className={styles.Icons}
              data-tooltip-id="dashboard-users"
              data-tooltip-content=" Dashboard"
            />
          </Link>
          <Link href="/profile/mydata">
            <Image
              src={myprofile}
              alt="image"
              className={styles.Icons}
              data-tooltip-id="profile-users"
              data-tooltip-content=" My Profile"
            />
          </Link>
          <Link href="/profile/my-applications">
            <Image
              src={posts}
              alt="image"
              className={styles.Icons}
              data-tooltip-id="my-apps-users"
              data-tooltip-content=" My Applications"
            />
          </Link>

          <button onClick={logOut} className={styles.logOutButton}>
            <Link href="/landing">
              <Image
                src={logoff}
                alt="image"
                className={styles.Icons}
                data-tooltip-id="logoff-users"
                data-tooltip-content=" Log Off"
              />
            </Link>
          </button>
        </div>

        <Tooltip id="dashboard-users" place="right" />
        <Tooltip id="profile-users" place="right" />
        <Tooltip id="my-apps-users" place="right" />
        <Tooltip id="favorites-users" place="right" />
        <Tooltip id="logoff-users" place="right" />
      </div>
    );
  } else if (isCompany) {
    return (
      <div className={styles.NavbarCompanies}>
        <div className={styles.IconsContainer}>
          <Link href="/company/dashboard">
            <Image
              src={dashboard}
              alt="image"
              className={styles.Icons}
              data-tooltip-id="dashboard-companies"
              data-tooltip-content=" Dashboard"
            />
          </Link>
          <Link href="/company/mydata">
            <Image
              src={myprofile}
              alt="image"
              className={styles.Icons}
              data-tooltip-id="profile-companies"
              data-tooltip-content=" My Profile"
            />
          </Link>
          <Link href="/company/my-posts">
            <Image
              src={posts}
              alt="image"
              className={styles.Icons}
              data-tooltip-id="myposts-companies"
              data-tooltip-content=" My Posts"
            />
          </Link>

          <button onClick={logOut} className={styles.logOutButton}>
            <Link href="/landing">
              <Image
                src={logoff}
                alt="image"
                className={styles.Icons}
                data-tooltip-id="logoff-companies"
                data-tooltip-content=" Log Off"
              />{" "}
            </Link>
          </button>
        </div>

        <Tooltip id="dashboard-companies" place="right" />
        <Tooltip id="profile-companies" place="right" />
        <Tooltip id="myposts-companies" place="right" />
        <Tooltip id="favorites-companies" place="right" />
        <Tooltip id="logoff-companies" place="right" />
      </div>
    );
  } else if (isPreLogIn) {
    return (
      <div className={styles.Navbar}>
        <div className={styles.IconsContainer}>
          <Link href="/landing">
            <Image
              src={home}
              alt="image"
              className={styles.Icons}
              data-tooltip-id="landing-home"
              data-tooltip-content=" Home"
            />
          </Link>
          <Link href="/loginpro">
            <Image
              src={loginusername}
              alt="image"
              className={styles.Icons}
              data-tooltip-id="landing-users"
              data-tooltip-content=" Log In Users"
            />
          </Link>
          <Link href="/logincomp">
            <Image
              src={logingroup}
              alt="image"
              className={styles.Icons}
              data-tooltip-id="landing-companies"
              data-tooltip-content=" Log In Companies"
            />
          </Link>
          <Link href="/about-us">
            <Image
              src={about}
              alt="image"
              className={styles.Icons}
              data-tooltip-id="landing-aboutus"
              data-tooltip-content=" About us"
            />
          </Link>
        </div>

        <Tooltip id="landing-home" place="right" />
        <Tooltip id="landing-users" place="right" />
        <Tooltip id="landing-companies" place="right" />
        <Tooltip id="landing-aboutus" place="right" />
      </div>
    );
  }
};

export default NavBar;
