"use client";

import React, { useEffect, useState } from "react";
import styles from "./myprofile.module.css";
import FileUploader from "../../components/FileUploaderCompanies/fileUploader";
import axios from "axios";
import PutCompanies from "../../components/profileCompaniesPutModal/putCompanies";
import { useRouter } from "next/navigation";

function MyProfileCompanies() {
  const [companyId, setCompanyId] = useState(null);
  const [companyData, setCompanyData] = useState(null);
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
    const storedCompanyData = JSON.parse(localStorage.getItem("companyData"));
    const companyId = storedCompanyData?.id; // Cambio aquí de userId a id
    setCompanyId(companyId);
    // console.log(`Company ID from localStorage: ${companyId}`);
  }, []);

  useEffect(() => {
    const storedCompanyData = JSON.parse(localStorage.getItem("companyData"));
    const companyId = storedCompanyData?.id;
    setCompanyId(companyId);
    // console.log(`Company ID from localStorage: ${companyId}`);

    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`/api/companies/${companyId}`);
        setCompanyData(response.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    if (companyId) {
      fetchCompanyData();
    }
  }, []);

  const deactivateAccount = async () => {
    try {
      const { data } = await axios.post("/api/deactivateCompany", {
        companyId: companyId,
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
            <h2>Success!</h2>
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
            Here you can modify your personal info and upload your profile
            picture.
          </p>
        </div>

        <div className={styles.content_container}>
          <div className={styles.modifyInfo_container}>
            <PutCompanies companyData={companyData} />
          </div>
          <div className={styles.fileUploader_container}>
            <FileUploader companyId={companyId} />
          </div>
        </div>
        <div className={styles.deactivateContainer}>
          <hr />
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

export default MyProfileCompanies;
