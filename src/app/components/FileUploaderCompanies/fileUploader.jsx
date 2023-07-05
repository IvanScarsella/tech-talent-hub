"use client";

import React from "react";
import { useState, useEffect } from "react";
import styles from "./fileUploader.module.css";

const FileUploader = ({ companyId }) => {
  //? USE STATE MODAL OK
  const [showModalOK, setShowModalOK] = useState(false);

  const toggleModalOK = () => {
    setShowModalOK(!showModalOK);
  };

  //? USE STATE MODAL OK
  const [showModalError, setShowModalError] = useState(false);

  const toggleModalError = () => {
    setShowModalError(!showModalError);
  };

  const [existingFileUrl, setExistingFileUrl] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedExtensions = /(\.png|\.jpeg|\.jpg)$/i;
      if (!allowedExtensions.exec(file.name)) {
        alert("Invalid file format. Please select a .png, .jpg or .jpeg file.");
        event.target.value = "";
      } else {
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "upload_preset",
            process.env.CLOUDINARY_UPLOAD_PRESET
          );

          const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (uploadResponse.ok) {
            const jsonResponse = await uploadResponse.json();
            // console.log("Archivo subido con éxito:", jsonResponse.url);

            const logo_Company = jsonResponse.url;

            // Once the file is uploaded to Cloudinary, then update the company with the new logo url
            const apiResponse = await fetch(`/api/companies/${companyId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                logo_Company,
              }),
            });

            if (apiResponse.ok) {
              setShowModalOK(true);

              const jsonResponse = await apiResponse.json();
              // console.log("Company logo updated successfully:", jsonResponse);
            } else {
              setShowModalError(true);

              console.error(
                "Error updating company logo:",
                apiResponse.status,
                apiResponse.statusText
              );
            }
          } else {
            console.error(
              "Error al subir el archivo:",
              uploadResponse.status,
              uploadResponse.statusText
            );
          }
        } catch (error) {
          console.error("Error al subir el archivo:", error);
        }
      }
    }
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`/api/companies/${companyId}`);
        const companyData = await response.json();

        if (companyData.logo_Company) {
          setExistingFileUrl(companyData.logo_Company);
        }
      } catch (error) {
        console.error("Error retrieving company data:", error);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  return (
    <>
      {showModalOK && (
        <div className={styles.modal}>
          <div className={styles.overlay} onClick={toggleModalOK}></div>
          <div className={styles.modal_content}>
            <span
              className={styles.close_button}
              onClick={() => {
                toggleModalOK();
                window.location.reload();
              }}
            >
              X
            </span>
            <h2>Success!</h2>
            <p>Profile picture updated successfully.</p>
            <button
              className={styles.btn_modal}
              onClick={() => {
                toggleModalOK();
                window.location.reload();
              }}
            >
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
            <h2>Error</h2>
            <p>
              We couldnt update your profile picture. Please try again in a few
              minutes.
            </p>
            <button className={styles.btn_modal} onClick={toggleModalError}>
              Close
            </button>
          </div>
        </div>
      )}
      <div className={styles.container}>
        {existingFileUrl && (
          <div className={styles.containerProfile}>
            <div
              className={styles.existing_file}
              onClick={() => {
                document.getElementById("file").click();
              }}
            >
              <img
                src={existingFileUrl}
                className={styles.existing_fileImg}
                alt="Existing File"
              />
            </div>
            <h3>Click on the image to update</h3>
          </div>
        )}
        <label className={styles.custum_file_upload} for="file">
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24">
              <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
              <g
                stroke-linejoin="round"
                stroke-linecap="round"
                id="SVGRepo_tracerCarrier"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  fill=""
                  d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                ></path>{" "}
              </g>
            </svg>
          </div>
          <div className={styles.text}>
            <span>Click to update your picture</span>
          </div>
          <input
            type="file"
            id="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </>
  );
};

export default FileUploader;
