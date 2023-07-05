import Image from "next/image";
import Link from "next/link";
import styles from "./JobsOfferDetail.module.css";
import { useEffect, useState } from "react";
import VacancySendModal from "./vacancySendModal";

const JobsOfferDetail = ({
  userData,
  selectedJobId,
  setSelectedJobId,
  jobs,
}) => {
  const [job, setJob] = useState(null);
  const [showModalOK, setShowModalOK] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [showModalApplied, setShowModalApplied] = useState(false);
  const [showModalLimit, setShowModalLimit] = useState(false);

  const toggleModalOK = () => {
    setShowModalOK(!showModalOK);
  };

  const toggleModalLimit = () => {
    setShowModalLimit(!showModalLimit);
  };

  const toggleModalError = () => {
    setShowModalError(!showModalError);
  };

  const toggleModalApplied = () => {
    setShowModalApplied(!showModalApplied);
  };

  const applyJob = async (userId, jobId) => {
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, jobId }),
      });

      const responseData = await response.json();

      switch (response.status) {
        case 200:
          toggleModalOK(); // Show success modal
          break;
        case 403:
          toggleModalApplied(); // Show already applied modal
          break;
        case 409: // HTTP status code for "Conflict" or "Already applied"
          toggleModalLimit(); // Show limit reached modal
          break;
        default:
          toggleModalError(); // Show error modal
      }
    } catch (error) {
      // console.log(`Error: ${error}`); // Log the error
      toggleModalError(); // Show error modal
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      const jobDetail = jobs.find((job) => job.id === selectedJobId);
      setJob(jobDetail);
    } else {
      setSelectedJobId(null);
      setJob(null);
    }
  }, [selectedJobId, jobs]);

  if (!job) {
    return null; // Return null instead of an empty div when there's no job
  }
  return (
    <div className={styles.ContainerDetail}>
      <div className={styles.InfoContainer}>
        <div className={styles.CompanyNameContainer}>
          <span className={styles.span}>{job.company && job.company.name}</span>
          <img
            src={job.logo_Company}
            alt="Company Logo"
            className={styles.image}
          />
        </div>
        <div className={styles.subtitleContainer}>
          <span className={styles.spanSubtitle}>{job.name_Vacancy}</span>
          <span className={styles.spanSubtitle}> {job.seniority} </span>
        </div>
      </div>
      <div className={styles.contenedorSpan}>
        <span>{job.start}</span>
      </div>
      <div className={styles.contenedorSpan}>
        <span>{job.requires}</span>
      </div>
      <div className={styles.contenedorDescription}>
        <span>{job.description}</span>
      </div>
      <div className={styles.contenedorSalary}>
        <span className={styles.salaryTitle}>Salary:</span>
        <span>{`${job.salary} USD`}</span>
        <br />
        <span className={styles.techTitle}>Technologies:</span>
        <span>{job.programming_Languages.join(",  ")}</span>
      </div>
      <div className={styles.contenedorSpan}>
        <span>{job.start}</span>
      </div>
      <div className={styles.contenedorSpan}>
        <span>{job.end}</span>
      </div>
      <div className={styles.contenedorButton}>
        <button
          className={styles.button}
          onClick={() => {
            if (userData && job) {
              applyJob(userData.id, job.id);
            } else {
              console.error("Either userData or job is null:", {
                userData,
                job,
              });
            }
          }}
        >
          Apply
        </button>
        {showModalOK && (
          <div className={styles.modal}>
            <div className={styles.overlay} onClick={toggleModalOK}></div>
            <div className={styles.modal_content}>
              <span className={styles.close_button} onClick={toggleModalOK}>
                X
              </span>
              <h2 className={styles.successTitle}>Success!</h2>
              <p>You applied to the job successfully.</p>
              <button className={styles.btn_modal} onClick={toggleModalOK}>
                Close
              </button>
            </div>
          </div>
        )}
        {showModalLimit && (
          <div className={styles.modal}>
            <div className={styles.overlay} onClick={toggleModalLimit}></div>
            <div className={styles.modal_content}>
              <span className={styles.close_button} onClick={toggleModalLimit}>
                X
              </span>
              <h2 className={styles.successTitle}>Oops</h2>
              <p>
                You reached the limit of applications. Please consider becoming
                a Premium member to enjoy limitless applications!
              </p>
              <button className={styles.btn_modal} onClick={toggleModalLimit}>
                Close
              </button>
            </div>
          </div>
        )}
        {showModalApplied && (
          <div className={styles.modal}>
            <div className={styles.overlay} onClick={toggleModalApplied}></div>
            <div className={styles.modal_content}>
              <span
                className={styles.close_button}
                onClick={toggleModalApplied}
              >
                X
              </span>
              <h2 className={styles.successTitle}>Oops</h2>
              <p>You already applied to that job. Try another one!</p>
              <button className={styles.btn_modal} onClick={toggleModalApplied}>
                Close
              </button>
            </div>
          </div>
        )}
        {showModalError && (
          <div className={styles.modal}>
            <div className={styles.overlay} onClick={toggleModalError}></div>
            <div className={styles.modal_content}>
              <span className={styles.close_button} onClick={toggleModalError}>
                X
              </span>
              <h2 className={styles.errorTitle}>Error</h2>
              <p>Error applying to the job. Please try again later.</p>
              <button className={styles.btn_modal} onClick={toggleModalError}>
                Close
              </button>
            </div>
          </div>
        )}
        {/* {showModal && <VacancySendModal toggleModal={toggleModal} />} */}
      </div>
    </div>
  );
};

export default JobsOfferDetail;
