import React from "react";
import styles from "./JobsOfferCardsContainer.module.css";
import JobsOfferCard from "../JobsOffer Card/JobsOfferCard";

const JobsOfferCardsContainer = ({ jobs, section }) => {
  const firstFiveJobs = jobs.slice(0, 4);
  const companyName = jobs.company && jobs.company.name;
  // console.log(jobs[0].company)
  return (
    <div className={styles.ContainerJobs}>
      {firstFiveJobs.map((job, index) => (
        <JobsOfferCard
          key={index}
          id={job.id}
          company={job.company.name}
          logo_Company={job.logo_Company}
          name_Vacancy={job.name_Vacancy}
          /*           seniority={job.seniority}
           */ showButton={true}
          showSpan={false}
          section={section}
        />
      ))}
    </div>
  );
};

export default JobsOfferCardsContainer;
