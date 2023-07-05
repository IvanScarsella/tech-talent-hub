"use client";

import React, { useEffect, useState } from "react";
import styles from "./myprofile.module.css";
import FileUploader from "../../components/FileUploaderUsers/fileUploader";
import axios from "axios";
import PutUsers from "../../components/profileUsersPutModal/putUsers";
import Services from "../../services/page";
import { useRouter } from "next/navigation";

function MyProfileUsers() {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  //? MODAL STATE
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  //? USE STATE MODAL OK
  const [showModalOK, setShowModalOK] = useState(false);

  const toggleModalOK = () => {
    setShowModalOK(!showModalOK);
  };

  //? USE STATE MODAL ERROR
  const [deactivationError, setDeactivationError] = useState(false);

  const toggleModalError = () => {
    setDeactivationError(!deactivationError);
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const userId = storedUserData?.id;
    setUserId(userId);
    // console.log(`User ID from localStorage: ${userId}`);
    // console.log(localStorage.userData);

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setUserData(response.data);

        // Log the data
        // console.log("Fetched user data:", response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const deactivateAccount = async () => {
    try {
      const { data } = await axios.post("/api/deactivateUser", {
        userId: userId,
      });

      if (data.success === true) {
        setShowModalOK(true);
      } else {
        setDeactivationError(true);
      }
    } catch (error) {
      // console.log(error);
      setDeactivationError(true);
    }
  };

  return (
    <>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.overlay} onClick={toggleModal}></div>
          <div className={styles.modal_content}>
            <span className={styles.close_button} onClick={toggleModal}>
              X
            </span>
            <h2>Are you sure you want to deactivate your account?</h2>
            <div className={styles.modal_buttons}>
              <button className={styles.btn_modal1} onClick={deactivateAccount}>
                Confirm
              </button>
              <button className={styles.btn_modal2} onClick={toggleModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showModalOK && (
        <div className={styles.modal}>
          <div className={styles.overlay} onClick={toggleModalOK}></div>
          <div className={styles.modal_content}>
            <span className={styles.close_button} onClick={toggleModalOK}>
              X
            </span>
            <h2 className={styles.successTitle}>Success!</h2>
            <p>
              Your account was deactivated successfully. You will now be
              redirected to the Home Page.
            </p>
            <button
              className={styles.btn_modal}
              onClick={() => {
                router.push("/landing");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {deactivationError && (
        <div className={styles.modal}>
          <div className={styles.overlay} onClick={toggleModalError}></div>
          <div className={styles.modal_content}>
            <span className={styles.close_button} onClick={toggleModalError}>
              X
            </span>
            <h2>Error</h2>
            <p>
              Sorry, your account couldn't be deactivated. Please try again.
            </p>
            <button className={styles.btn_modal} onClick={toggleModalError}>
              Close
            </button>
          </div>
        </div>
      )}
      <div className={styles.page_container}>
        <div className={styles.title_container}>
          <h1 className={styles.title}>My Profile</h1>
          <p className={styles.p}>
            Here you can modify your personal data and upload your CV.
          </p>
        </div>

        <div className={styles.content_container}>
          <div className={styles.modifyInfo_container}>
            <PutUsers userData={userData} />
          </div>
          <div className={styles.fileUploader_container}>
            <FileUploader userId={userId} />
          </div>
        </div>
        {userData &&
        userData.remainingPremiumDays < 7 &&
        userData.remainingPremiumDays !== 0 ? (
          <h3>
            Your subscription is about to expire, please upgrade your plan to
            continue enjoying the premium benefits!
          </h3>
        ) : null}
        <Services />
        <div className={styles.deactivateContainer}>
          <hr className={styles.divider} />
          <h3 className={styles.deactivateTitle}>Deactivate your account</h3>
          <p className={styles.p}>
            Don't worry! You can come back anytime you want - we will keep your
            account deactivated until you log in again.
          </p>
          <button
            className={styles.deactivateButton}
            onClick={() => setShowModal(true)}
          >
            Deactivate account
          </button>
        </div>
      </div>
    </>
  );
}

export default MyProfileUsers;
