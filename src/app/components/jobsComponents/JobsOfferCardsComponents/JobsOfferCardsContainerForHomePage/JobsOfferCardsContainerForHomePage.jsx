import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import JobsOfferCard from "../JobsOffer Card/JobsOfferCard";
import formatDate from "../../../../helpers/formatDate";
import JobsOfferDetail from "../../JobsOfferDetail/JobsOfferDetail";
import styles from "../JobsOfferCardsContainer/JobsOfferCardsContainer.module.css";
import axios from "axios";

const JobsOfferCardsContainerForHome = ({ jobs, user }) => {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [orderDirection, setOrderDirection] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const firstActiveJob = jobs?.find((job) => job.isActive);
    setSelectedJobId(firstActiveJob?.id);
  }, [jobs]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onJobSelected = (id) => {
    setSelectedJobId(id);
    if (windowWidth <= 600) {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const sendEmail = async () => {
    const mail = await axios.post("/api/sendEmail/postulation", {
      string: "string------",
    });
    // console.log(mail);
  };

  if (!user) return null;

  // console.log("user", user);
  // console.log("jobs del jobsOfferCardContainer", jobs);

  return (
    <div className={styles.forajido}>
      <div
        style={{
          maxHeight: "582px",
          overflowY: "auto",
          display: "flex",
        }}
      >
        <ul
          style={{
            flex: "1",
            color: "gray",
            textShadow: "white",
          }}
        >
          <div className={styles.fixedBar}>
            <span className={styles.allCandidates}>Vacancies</span>
            <button
              className={styles.botonOrden}
              onClick={() => setOrderDirection(!orderDirection)}
            >
              Order by Salary
            </button>
          </div>
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
      {windowWidth > 600 && (
        <JobsOfferDetail
          userData={user}
          userId={user.id}
          selectedJobId={selectedJobId}
          jobs={jobs}
          setSelectedJobId={setSelectedJobId}
        />
      )}
      {isModalOpen && (
        <ReactModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Job Details"
          className={styles.modal}
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: "blur(5px)", // Añade desenfoque
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Oscurece el fondo
              zIndex: 20000,
            },
            content: {
              animationName: "slideInUp", // Aplica la animación
              animationDuration: "0.5s", // Configura la duración de la animación
              height: "auto",
              marginTop: 50,
            },
          }}
        >
          <button className={styles.closeButton} onClick={closeModal}>
            X
          </button>
          <JobsOfferDetail
            userData={user}
            userId={user.id}
            selectedJobId={selectedJobId}
            jobs={jobs}
            setSelectedJobId={setSelectedJobId}
            className={styles.jobDetail}
          />
        </ReactModal>
      )}
    </div>
  );
};

export default JobsOfferCardsContainerForHome;
