export const validation = async (form, errors, setErrors) => {
  //? NAME VALIDATION
  if (form.name.length > 50) {
    setErrors((errors) => ({
      ...errors,
      name: "Please enter a name with less than 50 characters",
    }));
  } else {
    setErrors((errors) => ({
      ...errors,
      name: "",
    }));
  }
  //? LASTNAME VALIDATION
  if (form.lastname.length > 50) {
    setErrors((errors) => ({
      ...errors,
      lastname: "Please enter a last name with less than 50 characters",
    }));
  } else {
    setErrors((errors) => ({
      ...errors,
      lastname: "",
    }));
  }

  //? ABOUT ME VALIDATION
  if (form.aboutme.length > 2000) {
    setErrors((errors) => ({
      ...errors,
      aboutme: "Please enter a description with less than 2000 characters",
    }));
  } else {
    setErrors((errors) => ({
      ...errors,
      aboutme: "",
    }));
  }

  //? DEGREE VALIDATION
  if (form.degree.length > 50) {
    setErrors((errors) => ({
      ...errors,
      degree: "Please enter a degree with less than 50 characters",
    }));
  } else {
    setErrors((errors) => ({
      ...errors,
      degree: "",
    }));
  }
};
