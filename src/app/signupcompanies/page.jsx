"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import styles from "./signupcompanies.module.css";
import Select from "react-select";
import axios from "axios";
import Link from "next/link";
import { eyeopen, eyeclosed, upload } from "../public/assets/imagesCodes";
import { validation } from "../helpers/signup-companies/validation";
import { countries, type } from "../helpers/signup-companies/variables";
import { GoogleLoginButton } from "../components/googleLoginButton/googleLoginButton";
import { usePathname } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";

function SignUp() {
  //? USE STATE SIGNUP GOOGLE
  const auth = getAuth();
  const [googleData, setGoogleData] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (googleData) {
      emailRef.current.value = googleData.email;
      setForm({
        ...form,
        email: googleData.email,
        password: "Google",
        googleAuth: true,
      });
      passRef.current.value = "Login with Google";
      setIsDisabled(true);
      setShowPassword(false);
    }
  }, [googleData]);

  const logout = () => {
    signOut(auth)
      .then(() => {
        setGoogleData(null);
        setForm({ ...form, email: "", password: "", googleAuth: false });
        emailRef.current.value = "";
        passRef.current.value = "";
        setIsDisabled(false);
      })
      .catch((error) => {
        alert(error);
      });
  };

  //? USE STATE FORM
  const [form, setForm] = useState({
    name: "",
    //?
    logo_Company: "",
    type: "",
    email: "",
    password: "",
    country: "",
    vacancies: 0,
    //?
    description: "",
    employes: 0,
    jobs: 0,
    googleAuth: false,
  });

  //? USE STATE ERRORS
  const [errors, setErrors] = useState({
    name: "",
    logo_Company: "",
    type: "",
    email: "",
    password: "",
    country: "",
    vacancies: "",
    employes: "",
    jobs: "",
  });

  //? USE STATE IMAGE
  const [imageURL, setImageURL] = useState(null);

  //? USE STATE IS VALID (BOTÓN SUBMIT DESHABILITADO)
  const [valid, setValid] = useState(false);

  //? USE STATE PASSWORD
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordIcon, setShowPasswordIcon] = useState(eyeclosed);

  //? USE STATE MODAL
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  //? TOGGLE PASSWORD
  const togglePassword = () => {
    setShowPassword(!showPassword);
    setShowPasswordIcon(showPassword ? eyeclosed : eyeopen);
  };
  const changeHandlerb = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET); // reemplaza con tu preset de subida de Cloudinary

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload`,
        formData
      );
      setImageURL(res.data.secure_url);
      setForm((prevState) => ({
        ...prevState,
        logo_Company: res.data.secure_url,
      }));
    } catch (err) {
      console.error(err);
    }
  };
  //? ON CHANGE INPUT HANDLER
  const changeHandler = (event) => {
    let property = event.target.name;
    let value = event.target.value;

    if (property === "country" || property === "type") {
      value = value ? value.value : "";
    }

    if (
      property === "vacancies" ||
      property === "jobs" ||
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
      setErrors,
      valid,
      setValid,
      isFormComplete
    );
  };

  //? ISFORMCOMPLETE FUNCTION
  const isFormComplete = () => {
    const {
      name,
      type,
      email,
      password,
      country,
      vacancies,
      employes,
      jobs,
    } = form;
    const {
      name: nameError,
      type: typeError,
      email: emailError,
      password: passwordError,
      country: countryError,
      vacancies: vacanciesError,
      employes: employesError,
      jobs: jobsError,
    } = errors;

    return (
      name !== "" &&
      type !== "" &&
      email !== "" &&
      password !== "" &&
      country !== "" &&
      vacancies > 0 &&
      employes > 0 &&
      jobs > 0 &&
      nameError === "" &&
      typeError === "" &&
      emailError === "" &&
      countryError === "" &&
      passwordError === "" &&
      vacanciesError === "" &&
      employesError === "" &&
      jobsError === ""
    );
  };

  //? USE EFFECT - SEND INFO TO VALIDATION.JS
  useEffect(() => {
    validation(form, errors, setErrors, valid, setValid, isFormComplete);
  }, []);

  //? SUBMIT BUTTON HANDLER
  const submitHandler = (event) => {
    event.preventDefault();
    axios
      .post("/api/companies", form)
      .then((response) => {
        setShowModal(true);
        setValid(false);
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  };

  //? DISABLE SUBMIT BUTTON WHEN VALID IS FALSE
  useEffect(() => {
    const submitButton = document.getElementById("submit-button");
    submitButton.disabled = !valid;
  }, [valid]);

  return (
    <>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.overlay} onClick={toggleModal}></div>
          <div className={styles.modal_content}>
            <span className={styles.close_button} onClick={toggleModal}>
              X
            </span>
            <h2>Thank you for registering!</h2>
            <p>
              Please Log In to your account to start looking for the best
              candidate for your company.
            </p>
            <Link href="/landing">
              <button className={styles.btn_modal}>Go to Home Page</button>
            </Link>
          </div>
        </div>
      )}
      <div className={styles.page_container}>
        <div className={styles.titles_container}>
          <h1 className={styles.title}>Sign up to Tech Talent Hub</h1>
          <h3 className={styles.subtitle}>
            Ready to find the best candidate for your company? We have the best
            IT talent pool of LatAm.
          </h3>
          <div className={styles.auth_cont}>
            {!googleData ? (
              <GoogleLoginButton
                pathname={pathname}
                setGoogleData={setGoogleData}
              />
            ) : (
              <div className={styles.logOff}>
                <span>
                  Hello {googleData.displayName}, if you do not want to log in
                  with Google
                </span>
                <button
                  className={styles.buttonLogOff}
                  onClick={() => logout()}
                >
                  Click here
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.form_container}>
          <form className={styles.form} onSubmit={submitHandler}>
            <div className={styles.row1_container}>
              {/* Name */}
              <div className={styles.name_container}>
                <label className={styles.name}>
                  Company Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter the name of your company"
                  className={styles.input_name}
                  onChange={changeHandler}
                />
                {errors.name !== null && (
                  <span className={styles.error_span}>{errors.name}</span>
                )}
              </div>
              {/* Logo Company */}
              <div className={styles.logo_Company_container}>
                <label className={styles.logo_Company}>Logo</label>
                <div className={styles.password_toggle_container}>
                  <input
                    type="file"
                    accept=".png"
                    name="logo_Company"
                    placeholder="Upload a PNG image"
                    className={styles.input_logo_Company}
                    onChange={changeHandlerb}
                  />
                  <Image src={upload} className={styles.upload_icon} />
                </div>
                {errors.logo_Company !== null && (
                  <span className={styles.error_span}>
                    {errors.logo_Company}
                  </span>
                )}
              </div>
            </div>
            {/* Email */}
            <div className={styles.email_container}>
              <label className={styles.email}>
                Email <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className={styles.input_email}
                onChange={changeHandler}
                disabled={isDisabled}
                ref={emailRef}
              />
              {errors.email !== null && (
                <span className={styles.error_span}>{errors.email}</span>
              )}
            </div>

            <div className={styles.row2_container}>
              {/* Type */}
              <div className={styles.type_container}>
                <label className={styles.type}>
                  What is the size of your company?
                  <span className={styles.required}>*</span>
                </label>
                <Select
                  options={type}
                  name="type"
                  required
                  onChange={(selectedOption) =>
                    changeHandler({
                      target: { name: "type", value: selectedOption },
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
                      width: "93%",
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

              {/* Password */}
              <div className={styles.password_container}>
                <label className={styles.password}>
                  Password <span className={styles.required}>*</span>
                </label>
                <div className={styles.password_toggle_container}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Enter a password"
                    className={styles.input_password}
                    onChange={changeHandler}
                    disabled={isDisabled}
                    ref={passRef}
                  />
                  <Image
                    src={showPasswordIcon}
                    alt={showPassword ? "Hide Password" : "Show Password"}
                    className={styles.password_icon}
                    onClick={togglePassword}
                  />
                </div>
                {errors.password !== null && (
                  <span className={styles.error_span}>{errors.password}</span>
                )}
              </div>

              {/* DIVIDER */}
            </div>
            <div className={styles.divider}>
              <hr />
            </div>

            <div className={styles.row3_container}>
              {/* Country */}
              <div className={styles.country_container}>
                <label className={styles.country}>
                  Country <span className={styles.required}>*</span>
                </label>
                <Select
                  options={countries}
                  name="country"
                  required
                  onChange={(selectedOption) =>
                    changeHandler({
                      target: { name: "country", value: selectedOption },
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
                      width: "93%",
                    }),
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      height: 50,
                    }),
                  }}
                />
              </div>

              {/* Vacancies */}
              <div className={styles.vacancies_container}>
                <label className={styles.vacancies}>
                  Vacancies <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  name="vacancies"
                  required
                  placeholder="How many vacancies are available?"
                  className={styles.input_vacancies}
                  onChange={changeHandler}
                />
                {errors.vacancies !== null && (
                  <span className={styles.error_span}>{errors.vacancies}</span>
                )}
              </div>
            </div>

            <div className={styles.row4_container}>
              {/* Employees */}
              <div className={styles.employes_container}>
                <label className={styles.employes}>
                  Employees <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  name="employes"
                  required
                  placeholder="How many employees do you have?"
                  className={styles.input_employes}
                  onChange={changeHandler}
                />
                {errors.employes !== null && (
                  <span className={styles.error_span}>{errors.employes}</span>
                )}
              </div>

              {/* Jobs */}
              <div className={styles.jobs_container}>
                <label className={styles.jobs}>
                  Jobs <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  name="jobs"
                  required
                  placeholder="How many areas does your company have?"
                  className={styles.input_jobs}
                  onChange={changeHandler}
                />
                {errors.jobs !== null && (
                  <span className={styles.error_span}>{errors.jobs}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className={styles.description_container}>
              <label className={styles.description}>Description</label>
              <textarea
                type="text"
                name="description"
                placeholder="Write a short summary about your company"
                className={styles.textarea_description}
                onChange={changeHandler}
              />
              {errors.description !== null && (
                <span className={styles.error_span}>{errors.description}</span>
              )}
            </div>

            {/* Botón */}
            <div className={styles.boton_container}>
              <button
                className={styles.button}
                type="submit"
                id="submit-button"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
