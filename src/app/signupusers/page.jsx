"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import styles from "./signup.module.css";
import Select from "react-select";
import axios from "axios";
import Link from "next/link";
import ReactDatePicker from "react-datepicker";
import format from "date-fns/format";
import "react-datepicker/dist/react-datepicker.css";
import { eyeopen, eyeclosed, upload } from "../public/assets/imagesCodes";
import { validation } from "../helpers/signup-users/validation";
import {
  progLanguages,
  countries,
  softSkills,
  seniority,
  working,
  languages,
  specialization,
  degrees,
} from "../helpers/signup-users/variables";
import { storage } from "@/src/firebase/firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { GoogleLoginButton } from "../components/googleLoginButton/googleLoginButton";
import { usePathname } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";

function SignUp() {
  //? USE STATE SIGNUP GOOGLE
  const auth = getAuth();
  const [googleData, setGoogleData] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [modalError, setModalError] = useState(false);
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const lastnameRef = useRef(null);
  const passRef = useRef(null);
  const pathname = usePathname();

  const toggleModalModalError = () => {
    setModalError(!modalError);
  };

  useEffect(() => {
    if (googleData) {
      const allName = googleData.displayName.split(" ");
      const name =
        allName.length >= 3 ? allName.slice(0, 2).join(" ") : allName[0];
      const lastname =
        allName.length >= 3 ? allName.slice(2, 4).join(" ") : allName[1];
      emailRef.current.value = googleData.email;
      nameRef.current.value = name;
      lastnameRef.current.value = lastname;
      setForm({
        ...form,
        email: googleData.email,
        name: name,
        lastname: lastname,
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
        setForm({
          ...form,
          email: "",
          name: "",
          lastname: "",
          password: "",
          googleAuth: false,
        });
        emailRef.current.value = "";
        lastnameRef.current.value = "";
        nameRef.current.value = "";
        passRef.current.value = "";
        setIsDisabled(false);
      })
      .catch((error) => {
        toggleModalModalError();
      });
  };

  //? USE STATE FORM
  const [form, setForm] = useState({
    username: "",
    name: "",
    lastname: "",
    birth: "",
    aboutme: "",
    working: false,
    country: "",
    email: "",
    password: "",
    degree: "",
    languages: [],
    progLanguages: [],
    seniority: "",
    cv: "",
    softSkills: [],
    specialization: "",
    recruiter: false,
    isPremium: false,
    googleAuth: false,
  });

  //? USE STATE ERRORS
  const [errors, setErrors] = useState({
    username: "",
    name: "",
    lastname: "",
    birth: "",
    aboutme: "",
    email: "",
    password: "",
    degree: "",
    cv: "",
  });

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

  //? USE STATE DATE PICKER
  const [startDate, setStartDate] = useState(null);

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

  const handleCvChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedExtensions = /(\.pdf)$/i;
      if (!allowedExtensions.exec(file.name)) {
        alert("Invalid file format. Please upload a PDF file.");
        event.target.value = "";
      } else {
        try {
          const storageRef = ref(storage, file.name);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.then(async () => {
            const url = await getDownloadURL(storageRef);
            setForm((prevState) => ({ ...prevState, cv: url })); // Update the 'cv' field in the 'form' object with the download URL
          });
        } catch (error) {
          console.error("Error uploading the file:", error);
        }
      }
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
      setErrors,
      valid,
      setValid,
      isFormCompleted
    );
  };
  //? ISFORMCOMPLETE FUNCTION
  const isFormCompleted = () => {
    const {
      username,
      name,
      lastname,
      birth,
      country,
      email,
      password,
      languages,
      progLanguages,
      specialization,
      softSkills,
    } = form;
    const {
      username: usernameError,
      name: nameError,
      lastname: lastnameError,
      birth: birthError,
      email: emailError,
      password: passwordError,
    } = errors;

    return (
      username !== "" &&
      name !== "" &&
      lastname !== "" &&
      birth !== "" &&
      country !== "" &&
      email !== "" &&
      password !== "" &&
      languages.length !== 0 &&
      progLanguages.length !== 0 &&
      specialization !== "" &&
      softSkills.length !== 0 &&
      usernameError === "" &&
      nameError === "" &&
      lastnameError === "" &&
      birthError === "" &&
      emailError === "" &&
      passwordError === ""
    );
  };

  //? USE EFFECT - SEND INFO TO VALIDATION.JS
  useEffect(() => {
    validation(form, errors, setErrors, valid, setValid, isFormCompleted);
  }, [form]);

  //? SUBMIT BUTTON HANDLER
  const submitHandler = (event) => {
    event.preventDefault();
    axios
      .post("/api/users", form)
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
              Please Log In to your account to start looking for your dream job.
            </p>
            <Link href="/landing">
              <button className={styles.btn_modal}>Go to Home Page</button>
            </Link>
          </div>
        </div>
      )}
      {modalError && (
        <div className={styles.modal}>
          <div className={styles.overlay} onClick={toggleModalModalError}></div>
          <div className={styles.modal_content}>
            <span
              className={styles.close_button}
              onClick={toggleModalModalError}
            >
              X
            </span>
            <h2>Oops</h2>
            <p>That user already exists.</p>
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
            Ready to find your dream job? Discover companies from all over
            Israel
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
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your first name"
                  className={styles.input_name}
                  onChange={changeHandler}
                  ref={nameRef}
                />
                {errors.name !== null && (
                  <span className={styles.error_span}>{errors.name}</span>
                )}
              </div>
              {/* LastName */}
              <div className={styles.lastname_container}>
                <label className={styles.lastname}>
                  Last Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Enter your last name"
                  className={styles.input_lastname}
                  onChange={changeHandler}
                  ref={lastnameRef}
                />
                {errors.lastname !== null && (
                  <span className={styles.error_span}>{errors.lastname}</span>
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
              {/* Username */}
              <div className={styles.username_container}>
                <label className={styles.username}>
                  Username <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter the username you want to use on the site"
                  className={styles.input_username}
                  onChange={changeHandler}
                />
                {errors.username !== null && (
                  <span className={styles.error_span}>{errors.username}</span>
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
              {/* Date of Birth */}
              <div className={styles.dateOfBirth_container}>
                <label className={styles.dateOfBirth}>
                  Date of Birth <span className={styles.required}>*</span>
                </label>

                <ReactDatePicker
                  selected={startDate}
                  onChange={handleDateOfBirthChange}
                  className={styles.input_dateOfBirth}
                  placeholderText="Select your date of birth"
                  dateFormat="dd/MM/yyyy"
                />
                {errors.birth !== null && (
                  <span className={styles.error_span}>{errors.birth}</span>
                )}
              </div>

              {/* CV */}
              <div className={styles.cv_container}>
                <label className={styles.cv}>Curriculum Vitae</label>
                <div className={styles.password_toggle_container}>
                  <input
                    type="file"
                    accept=".pdf"
                    id="file"
                    className={styles.input_cv}
                    onChange={handleCvChange}
                  />
                </div>

                {errors.cv !== null && (
                  <span className={styles.error_span}>{errors.cv}</span>
                )}
              </div>
            </div>

            <div className={styles.row4_container}>
              {/* Country */}
              <div className={styles.country_container}>
                <label className={styles.country}>
                  Country <span className={styles.required}>*</span>
                </label>
                <Select
                  options={countries}
                  name="country"
                  onChange={(selectedOption) =>
                    changeHandler({
                      target: { name: "country", value: selectedOption },
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

              {/* Programming Languages */}
              <div className={styles.progLanguages_container}>
                <label className={styles.progLanguages}>
                  Programming Languages{" "}
                  <span className={styles.required}>*</span>
                </label>
                <Select
                  isMulti
                  options={progLanguages}
                  name="progLanguages"
                  onChange={(selectedOptions) =>
                    changeHandler({
                      target: { name: "progLanguages", value: selectedOptions },
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
            </div>

            <div className={styles.row5_container}>
              {/* Degree */}
              <div className={styles.degree_container}>
                <label className={styles.degree}>Degree</label>
                <Select
                  options={degrees}
                  name="degree"
                  onChange={(selectedOption) =>
                    changeHandler({
                      target: { name: "degree", value: selectedOption },
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

              {/* Soft Skills */}
              <div className={styles.softSkills_container}>
                <label className={styles.softSkills}>
                  Soft Skills <span className={styles.required}>*</span>
                </label>
                <Select
                  isMulti
                  options={softSkills}
                  name="softSkills"
                  onChange={(selectedOptions) =>
                    changeHandler({
                      target: { name: "softSkills", value: selectedOptions },
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
                  <span className={styles.error_span}>{errors.softSkills}</span>
                )}
              </div>
            </div>

            <div className={styles.row6_container}>
              {/* Languages */}
              <div className={styles.languages_container}>
                <label className={styles.languages}>
                  Languages <span className={styles.required}>*</span>
                </label>
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

              {/* Seniority */}
              <div className={styles.seniority_container}>
                <label className={styles.seniority}>Seniority</label>
                <Select
                  options={seniority}
                  name="seniority"
                  onChange={(selectedOption) =>
                    changeHandler({
                      target: { name: "seniority", value: selectedOption },
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
            </div>

            <div className={styles.row7_container}>
              {/* Specialization */}
              <div className={styles.specialization_container}>
                <label className={styles.specialization}>
                  Specialization <span className={styles.required}>*</span>
                </label>
                <Select
                  options={specialization}
                  name="specialization"
                  onChange={(selectedOption) =>
                    changeHandler({
                      target: { name: "specialization", value: selectedOption },
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

              {/* Working */}
              <div className={styles.working_container}>
                <label className={styles.working}>Work</label>
                <Select
                  options={working}
                  name="working"
                  onChange={(selectedOption) =>
                    changeHandler({
                      target: { name: "working", value: selectedOption },
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
            </div>

            {/* About Me */}
            <div className={styles.working_container}>
              <label className={styles.working}>About you</label>
              <textarea
                type="text"
                name="aboutme"
                placeholder="Write a short summary about yourself"
                className={styles.textarea_aboutMe}
                onChange={changeHandler}
              />
              {errors.aboutme !== null && (
                <span className={styles.error_span}>{errors.aboutme}</span>
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
