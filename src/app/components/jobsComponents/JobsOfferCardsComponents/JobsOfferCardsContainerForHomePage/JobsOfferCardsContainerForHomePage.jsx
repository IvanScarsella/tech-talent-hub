import React, { useState, useEffect } from "react";
import styles from "../JobsOfferCardsContainer/JobsOfferCardsContainer.module.css";
import JobsOfferCard from "../JobsOffer Card/JobsOfferCard";
import formatDate from "../../../../helpers/formatDate";
import JobsOfferDetail from "../../JobsOfferDetail/JobsOfferDetail";
import axios from "axios";

const JobsOfferCardsContainerForHome = ({ jobs, user }) => {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [orderDirection, setOrderDirection] = useState(true);

  useEffect(() => {
    const firstActiveJob = jobs?.find((job) => job.isActive);
    setSelectedJobId(firstActiveJob?.id);
  }, [jobs]);

  const onJobSelected = (id) => {
    setSelectedJobId(id);
  };

  const sendEmail = async () => {
    const mail = await axios.post("/api/sendEmail/postulation", {
      string: "string------",
    });
    console.log(mail);
  };

  if (!user) return null;

  console.log("user", user);
  console.log("jobs del jobsOfferCardContainer", jobs);

  return (
    <div className={styles.forajido}>
      <div className={styles.fixedBar}>
        <span className={styles.allCandidates}>Vacancies</span>
        <button
          className={styles.botonOrden}
          onClick={() => setOrderDirection(!orderDirection)}
        >
          Order by Salary
        </button>
      </div>
      <div
        style={{
          maxHeight: "572px",
          overflowY: "auto",
          display: "flex",
          marginTop: "30px",
        }}
      >
        <ul
          style={{
            flex: "1",
            color: "gray",
            textShadow: "white",
          }}
        >
          {jobs &&
            jobs
              .filter((job) => job.isActive)
              .sort((a, b) => {
                if (orderDirection) {
                  return a.salary - b.salary; // ascending order
                } else {
                  return b.salary - a.salary; // descending order
                }
              })
              .map((job, index) => {
                const companyName = job.company && job.company.name;
                formatDate(job.createdAt);

                return (
                  <JobsOfferCard
                    key={index}
                    id={job.id}
                    company={companyName}
                    name_Vacancy={job.name_Vacancy}
                    seniority={job.seniority}
                    showSpan={true}
                    onJobSelected={onJobSelected}
                    createdAt={formatDate(job.createdAt)}
                  />
                );
              })}
        </ul>
      </div>
      <JobsOfferDetail
        userData={user}
        userId={user.id}
        selectedJobId={selectedJobId}
        jobs={jobs}
        setSelectedJobId={setSelectedJobId}
      />
    </div>
  );
};

export default JobsOfferCardsContainerForHome;
