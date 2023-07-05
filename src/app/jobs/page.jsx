"use client";
import React from "react";
import styles from "./jobs.module.css";
import { jobsTemplate } from "../helpers/provisionalDB";
import JobsOfferCardsContainer from "../components/jobsComponents/JobsOfferCardsComponents/JobsOfferCardsContainer/JobsOfferCardsContainer";
import Image from "next/image";
import { samplepost } from "../public/assets/imagesCodes";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

/* const jobs = jobsTemplate;
 */
const JobsLanding = ({ section }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("api/vacancies")
      .then((res) => {
        // console.log(res.data);
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className={styles.allContainer}>
        <div className={styles.texts_container}>
          <h1 className={styles.title}>Find your dream job today</h1>
          <p className={styles.paragraph}>
            The biggest companies in Israel are looking for you
          </p>
        </div>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.spinner}></div>
            </div>
          ) : (
            <div className={styles.JobsContainer}>
              <JobsOfferCardsContainer jobs={jobs} section={section} />
            </div>
          )}
          <div className={styles.ImageContainer}></div>
          <Image src={samplepost} alt="imagen" className={styles.image} />
        </div>
      </div>
    </div>
  );
};

export default JobsLanding;
