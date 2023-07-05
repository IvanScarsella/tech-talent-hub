"use client";
import React from "react";
import FormMyPosts from "../../components/myposts-companies/formMyPosts";
import styles from "./myposts.module.css";
import {
  myApplicationspicture,
  myposts,
} from "../../public/assets/imagesCodes";
import Image from "next/image";
import MyPostsCards from "../../components/jobsComponents/jobsOfferCardContainerForMyPosts/myPosts";
import { useState, useEffect } from "react";
import { StyleRegistry } from "styled-jsx";

function MyPosts(props) {
  const [companyData, setCompanyData] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [companyPicture, setCompanyPicture] = useState(null);

  useEffect(() => {
    const localStorageData = localStorage.getItem("companyData");
    const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
    // console.log("parsedData", parsedData);

    if (parsedData) {
      setCompanyData(parsedData);
      setCompanyId(parsedData.id);
      setCompanyPicture(parsedData.logo_Company);
    }
  }, []);

  // console.log("companyData", companyData);

  return (
    <>
      <div className={styles.page_container}>
        <div className={styles.posts_container}>
          <div className={styles.title_container}>
            <h1 className={styles.title}>My Posts</h1>
            <p className={styles.p}>
              Here you can add new vacancies and edit the status of the ones you
              currently have.
            </p>
          </div>
          <div className={styles.content}>
            <div className={styles.gapMobil}>
              <MyPostsCards companyId={companyId} />
              <FormMyPosts parsedData={companyData} />
            </div>

            <div className={styles.pictureContainer}>
              <Image src={myposts} alt="myApplicationspicture" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyPosts;
