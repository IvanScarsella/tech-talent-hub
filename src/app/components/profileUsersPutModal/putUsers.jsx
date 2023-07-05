"use client";

import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import Link from "next/link";
import ReactDatePicker from "react-datepicker";
import format from "date-fns/format";
import "react-datepicker/dist/react-datepicker.css";
import { GlobalContext } from "../../profile/layout";
import Layout from "../../profile/layout";
import { validation } from "../../helpers/putUsers/validation";
import "react-datepicker/dist/react-datepicker.css";
import {
  progLanguages,
  countries,
  softSkills,
  seniority,
  degrees,
  working,
  languages,
  specialization,
} from "../../helpers/signup-users/variables";
import styles from "./putUsers.module.css";

const PutUsers = ({ userData }) => {
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    birth: "",
    aboutme: "",
    working: false,
    country: "",
    degree: "",
    languages: [],
    progLanguages: [],
    seniority: "",
    softSkills: [],
    specialization: "",
    recruiter: false,
  });

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || "",
        lastname: userData.lastname || "",
        birth: userData.birth || "",
        aboutme: userData.aboutme || "",
        working: userData.working || false,
        country: userData.country || "",
        degree: userData.degree || "",
        languages: userData.languages || [],
        progLanguages: userData.progLanguages || [],
        seniority: userData.seniority || "",
        softSkills: userData.softSkills || [],
        specialization: userData.specialization || "",
        recruiter: userData.recruiter || false,
      });
    }
  }, [userData]);
  //? USE STATE ERRORS
  const [errors, setErrors] = useState({
    name: "",
    lastname: "",
    birth: "",
    aboutme: "",
    degree: "",
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

  //? USE STATE DATE PICKER
  const [startDate, setStartDate] = useState(new Date());

  //? CHANGE HANDLER DATE PICKER
  const handleDateOfBirthChange = (date) => {
    const currentDate = new Date(); // Obtener la fecha actual
    const formattedDate = date ? format(date, "dd/MM/yyyy") : "";

    if (date && date > currentDate) {
      // Si la fecha seleccionada es posterior a la fecha actual
      setErrors((errors) => ({
        ...errors,
        birth: "Please select a date earlier than today",
      }));
    } else {
      setErrors((errors) => ({
        ...errors,
        birth: "",
      }));

      setStartDate(date);
      setForm({
        ...form,
        birth: formattedDate,
      });
    }
  };

  //? ON CHANGE INPUT HANDLER
  const changeHandler = (event) => {
    let property = event.target.name;
    let value = event.target.value;

    if (
      property === "progLanguages" ||
      property === "softSkills" ||
      property === "languages"
    ) {
      value = Array.isArray(value) ? value.map((option) => option.value) : [];
    } else if (
      property === "country" ||
      property === "seniority" ||
      property === "working" ||
      property === "specialization" ||
      property === "degree"
    ) {
      value = value ? value.value : "";
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
      .patch(`/api/users/${userData.id}`, form)
      .then((response) => {
        setSpan(true);
        setValid(false);
      })
      .catch((err) => ({ error: err.message }));
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
            <h2>Edit your personal info</h2>

            <div className={styles.form_container}>
              <form
                className={styles.form}
                onSubmit={submitHandler}
                onClick={spanOff}
              >
                <div className={styles.row1_container}>
                  {/* Name */}
                  <div className={styles.name_container}>
                    <label className={styles.name}>Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your first name"
                      value={form.name}
                      className={styles.input_name}
                      onChange={changeHandler}
                    />
                    {errors.name !== null && (
                      <span className={styles.error_span}>{errors.name}</span>
                    )}
                  </div>
                  {/* LastName */}
                  <div className={styles.lastname_container}>
                    <label className={styles.lastname}>Last Name</label>
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Enter your last name"
                      value={form.lastname}
                      className={styles.input_lastname}
                      onChange={changeHandler}
                    />
                    {errors.lastname !== null && (
                      <span className={styles.error_span}>
                        {errors.lastname}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.row1_container}>
                  {/* Date of Birth */}
                  <div className={styles.dateOfBirth_container}>
                    <label className={styles.dateOfBirth}>Date of Birth</label>

                    <ReactDatePicker
                      selected={startDate}
                      onChange={handleDateOfBirthChange}
                      placeholder="Select your date of birth"
                      className={styles.input_dateOfBirth}
                      dateFormat="dd/MM/yyyy"
                    />
                    {errors.birth !== null && (
                      <span className={styles.error_span}>{errors.birth}</span>
                    )}
                  </div>

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
                            value: selectedOption,
                          },
                        })
                      }
                      isClearable={true}
                      isSearchable={true}
                      placeholder="Select your country of residence"
                      closeMenuOnSelect={true}
                      styles={{
                        container: (baseStyles, state) => ({
                          ...baseStyles,
                          borderStyle: "solid",
                          borderColor: "black",
                          borderWidth: "0.5px 0.5px 4px 0.5px",
                          fontSize: 18,
                          width: "93%",
                        }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          height: 50,
                        }),
                      }}
                    />
                  </div>
                </div>
                <div className={styles.row1_container}>
                  {/* Programming Languages */}
                  <div className={styles.progLanguages_container}>
                    <label className={styles.progLanguages}>
                      Programming Languages
                    </label>
                    <Select
                      isMulti
                      options={progLanguages}
                      name="progLanguages"
                      onChange={(selectedOptions) =>
                        changeHandler({
                          target: {
                            name: "progLanguages",
                            value: selectedOptions,
                          },
                        })
                      }
                      isClearable={false}
                      placeholder="Select the programming languages you know"
                      isSearchable={true}
                      closeMenuOnSelect={false}
                      styles={{
                        container: (baseStyles, state) => ({
                          ...baseStyles,
                          borderStyle: "solid",
                          borderColor: "black",
                          borderWidth: "0.5px 0.5px 4px 0.5px",
                          fontSize: 18,
                          width: "93%",
                        }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          height: 50,
                        }),
                      }}
                    />
                  </div>
                  {/* Degree */}
                  <div className={styles.degree_container}>
                    <label className={styles.degree}>Degree</label>
                    <Select
                      options={degrees}
                      name="degree"
                      value={degrees.find(
                        (option) => option.value === form.degree
                      )}
                      onChange={(selectedOption) =>
                        changeHandler({
                          target: {
                            name: "degree",
                            value: selectedOption,
                          },
                        })
                      }
                      isClearable={true}
                      isSearchable={true}
                      placeholder="Select the last degree you have"
                      closeMenuOnSelect={true}
                      styles={{
                        container: (baseStyles, state) => ({
                          ...baseStyles,
                          borderStyle: "solid",
                          borderColor: "black",
                          borderWidth: "0.5px 0.5px 4px 0.5px",
                          fontSize: 18,
                          width: "93%",
                        }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          height: 50,
                        }),
                      }}
                    />
                  </div>
                </div>
                <div className={styles.row1_container}>
                  {/* Soft Skills */}
                  <div className={styles.softSkills_container}>
                    <label className={styles.softSkills}>Soft Skills</label>
                    <Select
                      isMulti
                      options={softSkills}
                      name="softSkills"
                      onChange={(selectedOptions) =>
                        changeHandler({
                          target: {
                            name: "softSkills",
                            value: selectedOptions,
                          },
                        })
                      }
                      isClearable={false}
                      isSearchable={true}
                      placeholder="Select the soft skills that better describe you"
                      closeMenuOnSelect={false}
                      styles={{
                        container: (baseStyles, state) => ({
                          ...baseStyles,
                          borderStyle: "solid",
                          borderColor: "black",
                          borderWidth: "0.5px 0.5px 4px 0.5px",
                          fontSize: 18,
                          width: "93%",
                        }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          height: 50,
                        }),
                      }}
                    />
                    {errors.softSkills !== null && (
                      <span className={styles.error_span}>
                        {errors.softSkills}
                      </span>
                    )}
                  </div>
                  {/* Languages */}
                  <div className={styles.languages_container}>
                    <label className={styles.languages}>Languages</label>
                    <Select
                      isMulti
                      options={languages}
                      name="languages"
                      onChange={(selectedOptions) =>
                        changeHandler({
                          target: { name: "languages", value: selectedOptions },
                        })
                      }
                      isClearable={false}
                      isSearchable={true}
                      placeholder="Select the languages you know"
                      closeMenuOnSelect={false}
                      styles={{
                        container: (baseStyles, state) => ({
                          ...baseStyles,
                          borderStyle: "solid",
                          borderColor: "black",
                          borderWidth: "0.5px 0.5px 4px 0.5px",
                          fontSize: 18,
                          width: "93%",
                        }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          height: 50,
                        }),
                      }}
                    />
                  </div>
                </div>

                <div className={styles.row1_container}>
                  {/* Seniority */}
                  <div className={styles.seniority_container}>
                    <label className={styles.seniority}>Seniority</label>
                    <Select
                      options={seniority}
                      name="seniority"
                      value={seniority.find(
                        (option) => option.value === form.seniority
                      )}
                      onChange={(selectedOption) =>
                        changeHandler({
                          target: {
                            name: "seniority",
                            value: selectedOption,
                          },
                        })
                      }
                      isClearable={true}
                      placeholder="Select your seniority"
                      isSearchable={true}
                      closeMenuOnSelect={true}
                      styles={{
                        container: (baseStyles, state) => ({
                          ...baseStyles,
                          borderStyle: "solid",
                          borderColor: "black",
                          borderWidth: "0.5px 0.5px 4px 0.5px",
                          fontSize: 18,
                          width: "93%",
                        }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          height: 50,
                        }),
                      }}
                    />
                  </div>
                  {/* Specialization */}
                  <div className={styles.specialization_container}>
                    <label className={styles.specialization}>
                      Specialization
                    </label>
                    <Select
                      options={specialization}
                      name="specialization"
                      value={specialization.find(
                        (option) => option.value === form.specialization
                      )}
                      onChange={(selectedOption) =>
                        changeHandler({
                          target: {
                            name: "specialization",
                            value: selectedOption,
                          },
                        })
                      }
                      isClearable={true}
                      placeholder="What do you specialize in?"
                      isSearchable={true}
                      closeMenuOnSelect={true}
                      styles={{
                        container: (baseStyles, state) => ({
                          ...baseStyles,
                          borderStyle: "solid",
                          borderColor: "black",
                          borderWidth: "0.5px 0.5px 4px 0.5px",
                          fontSize: 18,
                          width: "93%",
                        }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          height: 50,
                        }),
                      }}
                    />
                  </div>
                </div>

                <div className={styles.row1_container}>
                  {/* Working */}
                  <div className={styles.working_container}>
                    <label className={styles.working}>Work</label>
                    <Select
                      options={working}
                      name="working"
                      value={working.find(
                        (option) => option.value === form.working
                      )}
                      onChange={(selectedOption) =>
                        changeHandler({
                          target: {
                            name: "working",
                            value: selectedOption,
                          },
                        })
                      }
                      isClearable={true}
                      isSearchable={true}
                      placeholder="Are you currently working?"
                      closeMenuOnSelect={true}
                      styles={{
                        container: (baseStyles, state) => ({
                          ...baseStyles,
                          borderStyle: "solid",
                          borderColor: "black",
                          borderWidth: "0.5px 0.5px 4px 0.5px",
                          fontSize: 18,
                          width: "93%",
                        }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          height: 50,
                        }),
                      }}
                    />
                  </div>
                  {/* About Me */}
                  <div className={styles.aboutme_container}>
                    <label className={styles.aboutme}>About you</label>
                    <textarea
                      type="text"
                      name="aboutme"
                      value={form.aboutme}
                      placeholder="Write a short summary about yourself"
                      className={styles.textarea_aboutme}
                      onChange={changeHandler}
                    />
                    {errors.aboutme !== null && (
                      <span className={styles.error_span}>
                        {errors.aboutme}
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
                      Your info was modified successfully!
                    </p>
                    <span className={styles.confirmation_span}>
                      <Link
                        href="/profile/mydata"
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

export default PutUsers;
