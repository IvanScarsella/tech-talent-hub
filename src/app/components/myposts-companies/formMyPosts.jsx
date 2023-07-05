"use client";

import React, { useContext } from "react";
import { subDays } from "date-fns";
import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import ReactDatePicker from "react-datepicker";
import format from "date-fns/format";
import Link from "next/link";
import { GlobalContext } from "../../company/layout";
import Layout from "../../company/layout";
import { validation } from "../../helpers/myposts-companies/validation";
import "react-datepicker/dist/react-datepicker.css";
import {
  seniority,
  vacancy,
  workday,
  programming_Languages,
} from "../../helpers/myposts-companies/variables";
import styles from "./formMyPosts.module.css";
import { parseISO } from "date-fns";

const FormMyPosts = ({ parsedData }) => {
  //? USE STATE FORM
  const [form, setForm] = useState({
    name_Vacancy: "",
    logo_Company: parsedData && parsedData.logo_Company,
    programming_Languages: [],
    seniority: "",
    description: "",
    workday: "",
    salary: 0,
    date_Hire: "",
    isActive: true,
    Relevance: "GLOBAL",
    companyId: parsedData && parsedData.id,
  });
  // console.log("hola", parsedData);
  //? USE STATE FORM
  const [errors, setErrors] = useState({
    name_Vacancy: "",
    seniority: "",
    description: "",
    workday: "",
    salary: "",
    date_Hire: "",
  });
  useEffect(() => {
    if (parsedData) {
      setForm((form) => ({
        ...form,
        logo_Company: parsedData.logo_Company,
        companyId: parsedData.id,
      }));
    }
  }, [parsedData]);
  //? USE STATE IS VALID (BOTÓN SUBMIT DESHABILITADO)
  const [valid, setValid] = useState(false);

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
  const startDateMin = subDays(new Date(), 1);
  const [startDate, setStartDate] = useState(null);

  //? CHANGE HANDLER DATE PICKER
  const handledateHireChange = (date) => {
    if (date > new Date()) {
      setStartDate(date);
      setForm({
        ...form,
        date_Hire: date instanceof Date ? date : parseISO(date),
      });
    }
  };
  //? ON CHANGE INPUT HANDLER
  const changeHandler = (event) => {
    let property = event.target.name;
    let value = event.target.value;

    if (
      property === "Relevance" ||
      property === "workday" ||
      property === "seniority" ||
      property === "name_Vacancy"
    ) {
      value = value ? value.value : "";
    }

    if (property === "programming_Languages") {
      value = Array.isArray(value) ? value.map((option) => option.value) : [];
    }

    if (property === "salary") {
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
      setErrors,
      valid,
      setValid,
      isFormComplete
    );
    // console.log(form);
  };

  //? ISFORMCOMPLETE FUNCTION
  const isFormComplete = () => {
    const {
      name_Vacancy,
      programming_Languages,
      seniority,
      description,
      workday,
      salary,
      date_Hire,
    } = form;
    const {
      name_Vacancy: nameVacancyError,
      programming_Languages: programmingLanguagesError,
      seniority: seniorityError,
      description: descriptionError,
      workday: workdayError,
      salary: salaryError,
      date_Hire: dateHireError,
    } = errors;

    return (
      name_Vacancy !== "" &&
      programming_Languages.length !== 0 &&
      seniority !== "" &&
      description !== "" &&
      workday !== "" &&
      salary > 0 &&
      date_Hire !== "" &&
      (nameVacancyError === "") & (seniorityError === "") &&
      descriptionError === "" &&
      workdayError === "" &&
      salaryError === "" &&
      dateHireError === ""
    );
  };

  //? USE EFFECT - SEND INFO TO VALIDATION.JS
  useEffect(() => {
    setSpan(false);
    validation(form, errors, setErrors, valid, setValid, isFormComplete);
  }, [form]);

  //? SUBMIT BUTTON HANDLER
  const submitHandler = (event) => {
    event.preventDefault();
    // setForm(form);
    // console.log(form);
    axios
      .post("/api/vacancies", form)
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
            <h2>Create New Post</h2>
            <p>
              Create a New Vacancy Post and find the best candidate for the job!
            </p>
            <div className={styles.form_container}>
              <form
                className={styles.form}
                onSubmit={submitHandler}
                onClick={spanOff}
              >
                <div className={styles.row1_container}>
                  {/* Name Vacancy */}
                  <div className={styles.name_Vacancy_container}>
                    <label className={styles.name_Vacancy}>
                      Vacancy Name <span className={styles.required}>*</span>
                    </label>
                    <Select
                      options={vacancy}
                      name="name_Vacancy"
                      required
                      onChange={(selectedOption) =>
                        changeHandler({
                          target: {
                            name: "name_Vacancy",
                            value: selectedOption,
                          },
                        })
                      }
                      isClearable={true}
                      isSearchable={true}
                      placeholder="Select the name of the vacancy"
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
                    {errors.name_Vacancy !== null && (
                      <span className={styles.error_span}>
                        {errors.name_Vacancy}
                      </span>
                    )}
                  </div>
                  {/* Salary */}
                  <div className={styles.salary_container}>
                    <label className={styles.salary}>
                      Salary (USD) <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={form.salary}
                      required
                      placeholder="Estimated Salary"
                      className={styles.input_salary}
                      onChange={changeHandler}
                    />
                    {errors.salary !== null && (
                      <span className={styles.error_span}>{errors.salary}</span>
                    )}
                  </div>
                </div>
                <div className={styles.row3_container}>
                  {/* Programming Languages */}
                  <div className={styles.programming_Languages_container}>
                    <label className={styles.programming_Languages}>
                      Programming Languages{" "}
                      <span className={styles.required}>*</span>
                    </label>
                    <Select
                      isMulti
                      options={programming_Languages}
                      name="programming_Languages"
                      required
                      onChange={(selectedOptions) =>
                        changeHandler({
                          target: {
                            name: "programming_Languages",
                            value: selectedOptions,
                          },
                        })
                      }
                      isClearable={false}
                      placeholder="Select the required programming languages"
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

                  {/* Hiring Date */}
                  <div className={styles.date_Hire_container}>
                    <label className={styles.date_Hire}>
                      Hiring date <span className={styles.required}>*</span>
                    </label>

                    <ReactDatePicker
                      selected={startDate}
                      onChange={handledateHireChange}
                      className={styles.input_date_Hire}
                      minDate={startDateMin}
                      placeholderText="Select a hiring date"
                      dateFormat="dd/MM/yyyy"
                    />
                    {errors.date_Hire !== null && (
                      <span className={styles.error_span}>
                        {errors.date_Hire}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.row3_container}>
                  {/* Seniority */}
                  <div className={styles.seniority_container}>
                    <label className={styles.seniority}>
                      Seniority <span className={styles.required}>*</span>
                    </label>
                    <Select
                      options={seniority}
                      name="seniority"
                      required
                      onChange={(selectedOption) =>
                        changeHandler({
                          target: { name: "seniority", value: selectedOption },
                        })
                      }
                      isClearable={true}
                      isSearchable={true}
                      placeholder="Select the required seniority"
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
                  {/* Workday */}
                  <div className={styles.workday_container}>
                    <label className={styles.workday}>
                      Employment Type <span className={styles.required}>*</span>
                    </label>
                    <Select
                      options={workday}
                      name="workday"
                      required
                      onChange={(selectedOption) =>
                        changeHandler({
                          target: { name: "workday", value: selectedOption },
                        })
                      }
                      isClearable={true}
                      isSearchable={true}
                      placeholder="Select the required workday"
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
                {/* Description */}
                <div className={styles.description_container}>
                  <label className={styles.description}>
                    Description <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    type="textarea"
                    name="description"
                    value={form.description}
                    placeholder="Write a short summary about the vacancy"
                    className={styles.textarea_description}
                    onChange={changeHandler}
                  />
                  {errors.description !== null && (
                    <span className={styles.error_span}>
                      {errors.description}
                    </span>
                  )}
                </div>
                <button
                  className={styles.btn_modal}
                  type="submit"
                  id="submit-button"
                  disabled={!valid}
                >
                  Create New Post
                </button>
                {span && (
                  <div className={styles.confirmation_container}>
                    <p className={styles.confirmation_p}>
                      {" "}
                      The post was created successfully!
                    </p>
                    <span className={styles.confirmation_span}>
                      You can create a new post or{" "}
                      <Link
                        href="/company/my-posts"
                        onClick={() => {
                          toggleModal();
                          spanOff();
                          window.location.reload();
                        }}
                      >
                        go back to your dashboard.
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
            Create new Post
          </button>
        </div>
      </div>
    </>
  );
};

export default FormMyPosts;
