import React from "react";
import styles from "./UserOfferDetail.module.css";

import { useEffect, useState } from "react";

function UserOfferDetail({
  selectedUserId,
  setSelectedUserId,
  users,
  companyData,
}) {
  const [user, setUser] = useState(null);
  const [noCV, setNoCV] = useState(false);
  const [connectOK, setConnectOK] = useState(false);
  const [connectError, setConnectError] = useState(false);

  const toggleModalNoCV = () => {
    setNoCV(!noCV);
  };

  const toggleModalConnectOK = () => {
    setConnectOK(!connectOK);
  };

  const toggleModalConnectError = () => {
    setConnectError(!connectError);
  };

  useEffect(() => {
    if (selectedUserId && users) {
      const userDetail = users.find((user) => user.id === selectedUserId);
      setUser(userDetail);
    } else {
      setSelectedUserId(null);
      setUser(null);
    }
  }, [selectedUserId, users]);

  const handleDownload = () => {
    if (user && user.cv) {
      window.open(user.cv);
    } else {
      toggleModalNoCV();
    }
  };

  const handleConnect = async () => {
    if (user) {
      try {
        const response = await fetch("/api/sendEmail/connection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: user.email,
            companyName: companyData.name,
            companyEmail: companyData.email,
          }),
        });

        if (response.ok) {
          toggleModalConnectOK();
        } else {
          throw new Error("Failed to send email");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        toggleModalConnectError();
      }
    }
  };
  if (!user) {
    return null;
  }

  return (
    <div>
      {noCV && (
        <div className={styles.modal}>
          <div className={styles.overlay} onClick={toggleModalNoCV}></div>
          <div className={styles.modal_content}>
            <span className={styles.close_button} onClick={toggleModalNoCV}>
              X
            </span>
            <h2 className={styles.successTitle}>Oops</h2>
            <p>There isn't a CV available for this candidate.</p>
            <button className={styles.btn_modal} onClick={toggleModalNoCV}>
              Close
            </button>
          </div>
        </div>
      )}
      {connectOK && (
        <div className={styles.modal}>
          <div className={styles.overlay} onClick={toggleModalConnectOK}></div>
          <div className={styles.modal_content}>
            <span
              className={styles.close_button}
              onClick={toggleModalConnectOK}
            >
              X
            </span>
            <h2 className={styles.successTitle}>Success!</h2>
            <p>We sent an email to the candidate with your information.</p>
            <button className={styles.btn_modal} onClick={toggleModalConnectOK}>
              Close
            </button>
          </div>
        </div>
      )}
      {connectError && (
        <div className={styles.modal}>
          <div
            className={styles.overlay}
            onClick={toggleModalConnectError}
          ></div>
          <div className={styles.modal_content}>
            <span
              className={styles.close_button}
              onClick={toggleModalConnectError}
            >
              X
            </span>
            <h2 className={styles.successTitle}>Error</h2>
            <p>
              There was an error trying to connect with the candidate. Please
              try again.
            </p>
            <button
              className={styles.btn_modal}
              onClick={toggleModalConnectError}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* {console.log(selectedUserId)} */}
      <div className={styles.ContainerDetail}>
        <div className={styles.InfoContainer}>
          <div className={styles.UserNameCompanyContainer}>
            <h1
              className={styles.username_name}
            >{`${user.name} ${user.lastname}`}</h1>
            <div className={styles.specializationContainer}>
              <h1 className={styles.country}>{user.specialization}</h1>
              <h4 className={styles.country}>{user.seniority}</h4>
              <h1 className={styles.country}>{user.country}</h1>
            </div>
          </div>
          <span className={styles.aboutme}>{user.aboutme}</span>
        </div>
        <div className={styles.listados}>
          <div className={styles.programming_container}>
            <span className={styles.span_programming}>Hard Skills:</span>
            <ul className={styles.ul_programming}>
              {user.progLanguages.map((lang, index) => (
                <li key={index}>{lang}</li>
              ))}
            </ul>
          </div>
          <div className={styles.programming_container}>
            <span className={styles.span_softskills}>Soft Skills:</span>
            <ul className={styles.ul_softskills}>
              {user.softSkills.map((soft, index) => (
                <li key={index}>{soft}</li>
              ))}
            </ul>
          </div>
          <div className={styles.programming_container}>
            <span className={styles.span_softskills}>Languages:</span>
            <ul className={styles.ul_softskills}>
              {user.languages.map((langu, index) => (
                <li key={index}>{langu}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.buttonConnect} onClick={handleConnect}>
            Connect
          </button>
          <button className={styles.buttonDownload} onClick={handleDownload}>
            Download Resume
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserOfferDetail;
