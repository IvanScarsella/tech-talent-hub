"use client";

import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import Link from "next/link";
import { GlobalContext } from "../../company/layout";
import Layout from "../../company/layout";
import { validation } from "../../helpers/putCompanies/validation";
import "react-datepicker/dist/react-datepicker.css";
import { countries, type } from "../../helpers/signup-companies/variables";
import styles from "./putCompanies.module.css";
import useWindowSize from "../../helpers/windowsSize";

const PutCompanies = ({ companyData }) => {
  //? USE STATE FORM
  const [form, setForm] = useState({
    type: "",
    country: "",
    vacancies: 0,
    description: "",
    employes: 0,
    jobs: 0,
  });

  useEffect(() => {
    if (companyData) {
      setForm({
        type: companyData.type || "",
        country: companyData.country || "",
        description: companyData.description || "",
        vacancies: companyData.vacancies || 0,
        employes: companyData.employes || 0,
        jobs: companyData.jobs || 0,
      });
    }
  }, [companyData]);

  //? USE STATE ERRORS
  const [errors, setErrors] = useState({
    type: "",
    country: "",
    vacancies: "",
    employes: "",
    jobs: "",
  });

  //? USE STATE SPAN CONFIRMATION
  const [span, setSpan] = useState(false);
  //? TURN OFF SPAN
  const spanOff = () => {
    setSpan(false);
  };

  //? USE STATE MODAL
  const [showModal, setShowModal] = useState(false);
  //? TOGGLE MODAL
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  //? ON CHANGE INPUT HANDLER
  const changeHandler = (event) => {
    let property = event.target.name;
    let value = event.target.value;

    if (
      property === "jobs" ||
      property === "vacancies" ||
      property === "employes"
    ) {
      value = parseInt(value);
    }
    setForm({
      ...form,
      [property]: value,
    });

    validation(
      {
        ...form,
        [property]: value,
      },
      errors,
      setErrors
    );
    // console.log(form);
  };

  //? USE EFFECT - SEND INFO TO VALIDATION.JS
  useEffect(() => {
    setSpan(false);
    validation(form, errors, setErrors);
  }, [form]);

  //? SUBMIT BUTTON HANDLER
  const submitHandler = (event) => {
    event.preventDefault();

    axios
      .patch(`/api/companies/${companyData.id}`, form)
      .then((response) => {
        setSpan(true);
        setValid(false);
      })
      .catch((err) => ({ error: err.message }));
  };

  const { width } = useWindowSize();

  return (
    <>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.overlay} onClick={toggleModal}></div>
          <div className={styles.modal_content}>
            <span className={styles.close_button} onClick={toggleModal}>
              X
            </span>
            <h2>Edit your personal info</h2>

            <div className={styles.form_container}>
              <form
                className={styles.form}
                onSubmit={submitHandler}
                onClick={spanOff}
              >
                <div className={styles.row1_container}>
                  {/* Country */}
                  <div className={styles.country_container}>
                    <label className={styles.country}>Country</label>
                    <Select
                      options={countries}
                      name="country"
                      value={countries.find(
                        (option) => option.value === form.country
                      )}
                      onChange={(selectedOption) =>
                        changeHandler({
                          target: {
                            name: "country",
                            value: selectedOption.value,
                          },
                        })
                      }
                      isClearable={true}
                      isSearchable={true}
                      placeholder="Select your company's home country"
                      closeMenuOnSelect={true}
                      styles={{
                        container: (baseStyles, state) => ({
                          ...baseStyles,
                          borderStyle: "solid",
                          borderColor: "black",
                          borderWidth: "0.5px 0.5px 4px 0.5px",
                          fontSize: 18,
                          width: width <= 600 ? "40%" : "93%",
                        }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          height: 50,
                        }),
                      }}
                    />
                  </div>
                  {/* Employees */}
                  <div className={styles.employes_container}>
                    <label className={styles.employes}>Employees</label>
                    <input
                      type="number"
                      name="employes"
                      value={form.employes}
                      placeholder="How many employees do you have?"
                      className={styles.input_employes}
                      onChange={changeHandler}
                    />
                    {errors.employes !== null && (
                      <span className={styles.error_span}>
                        {errors.employes}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.row3_container}>
                  {/* Type */}
                  <div className={styles.type_container}>
                    <label className={styles.type}>
                      What is the size of your company?
                    </label>
                    <Select
                      options={type}
                      name="type"
                      value={type.find((option) => option.value === form.type)}
                      onChange={(selectedOption) =>
                        changeHandler({
                          target: { name: "type", value: selectedOption.value },
                        })
                      }
                      isClearable={true}
                      isSearchable={true}
                      placeholder="Please select an option"
                      closeMenuOnSelect={true}
                      styles={{
                        container: (baseStyles, state) => ({
                          ...baseStyles,
                          borderStyle: "solid",
                          borderColor: "black",
                          borderWidth: "0.5px 0.5px 4px 0.5px",
                          fontSize: 18,
                          width: width <= 600 ? "40%" : "93%",
                        }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          height: 50,
                        }),
                      }}
                    />
                    {errors.type !== null && (
                      <span className={styles.error_span}>{errors.type}</span>
                    )}
                  </div>
                  {/* Jobs */}
                  <div className={styles.jobs_container}>
                    <label className={styles.jobs}>Jobs</label>
                    {/* <span className={styles.required}>*</span> */}
                    <input
                      type="number"
                      name="jobs"
                      value={form.jobs}
                      placeholder="How many areas does your company have?"
                      className={styles.input_jobs}
                      onChange={changeHandler}
                    />
                    {errors.jobs !== null && (
                      <span className={styles.error_span}>{errors.jobs}</span>
                    )}
                  </div>
                </div>
                <div className={styles.row3_container}>
                  {/* Vacancies */}
                  <div className={styles.vacancies_container}>
                    <label className={styles.vacancies}>Vacancies</label>
                    <input
                      type="number"
                      name="vacancies"
                      value={form.vacancies}
                      placeholder="How many vacancies are available?"
                      className={styles.input_vacancies}
                      onChange={changeHandler}
                    />
                    {errors.vacancies !== null && (
                      <span className={styles.error_span}>
                        {errors.vacancies}
                      </span>
                    )}
                  </div>
                  {/* Description */}
                  <div className={styles.description_container}>
                    <label className={styles.description}>Description</label>
                    <textarea
                      type="text"
                      name="description"
                      value={form.description}
                      placeholder="Write a short summary about your company"
                      className={styles.textarea_description}
                      onChange={changeHandler}
                    />
                    {errors.description !== null && (
                      <span className={styles.error_span}>
                        {errors.description}
                      </span>
                    )}
                  </div>
                </div>

                <button className={styles.btn_modal} type="submit">
                  Confirm & Save
                </button>
                {span && (
                  <div className={styles.confirmation_container}>
                    <p className={styles.confirmation_p}>
                      {" "}
                      Your info was modified successfully!
                    </p>
                    <span className={styles.confirmation_span}>
                      <Link
                        href="/company/mydata"
                        onClick={() => {
                          toggleModal();
                          spanOff();
                        }}
                      >
                        Go back to your dashboard
                      </Link>
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      <div className={styles.page_container}>
        <div className={styles.button_container}>
          <button className={styles.btn_toForm} onClick={toggleModal}>
            Edit your personal info
          </button>
        </div>
      </div>
    </>
  );
};

export default PutCompanies;
