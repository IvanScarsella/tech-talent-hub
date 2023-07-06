import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import JobsOfferCard from "../JobsOfferCardsComponents/JobsOffer Card/JobsOfferCard";
import Link from "next/link";
import styles from "./myApplications.module.css";

const MyApplicationsCards = ({userId}) => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      axios
        .get("/api/vacancies")
        .then((response) => {
          const jobsFromServer = response.data;
          const filteredJobs = jobsFromServer.filter((job) =>
            job.applicants.some((applicant) => applicant.id === userId)
          );
          setJobs(filteredJobs);
          // console.log(jobs); // Agrega esta línea
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching jobs:", error);
        });
    }
  }, []); // Actualiza la llamada a la API cada vez que el user cambia

  return (
    <div className={styles.container}>
      <h2 className={styles.text}>Latest Applications:</h2>
      {isLoading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <div>
          {jobs.length === 0 ? (
            <div className={styles.noVacanciesContainer}>
              <p className={styles.noVacanciesText}>
                You haven't applied to any vacancies yet.
              </p>
              <p className={styles.noVacanciesText}>
                <Link href="/profile/dashboard">Go to your dashboard</Link> and
                apply to your dream job!
              </p>
            </div>
          ) : (
            <div className={styles.ContenedorJobs}>
              {jobs.map((job, index) => {
                const companyName = job.company && job.company.name;
                return (
                  <JobsOfferCard
                    key={index}
                    id={job.id}
                    company={companyName}
                    name_Vacancy={job.name_Vacancy}
                    showButton={false}
                    showSpan={true}
                    start={job.start}
                    onJobSelected={() => {}}
                    applicants={`${job.applicants.length} candidates applied`}
                    status={job.status}
                    seniority={job.seniority}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsCards;
