import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../SelectorFiltersForCompanyDashboard/SelectorFiltersForCompanyDashboard.module.css";

const FiltersSelectorProfile = ({
  setSelectedProgLanguage,
  setSelectedSeniority,
  setselectedNameVacancy,
  setSelectedWorkday,
}) => {
  const [programming_Languages, setProgramming_Languages] = useState([]);
  // const programming_Languages = [
  //   "C",
  //   "GO",
  //   "JAVA",
  //   "JAVASCRIPT",
  //   "KOTLIN",
  //   "R",
  //   "OBJECTIVEC",
  //   "PHP",
  //   "POSTSCRIPT",
  //   "PYTHON",
  //   "REACT",
  //   "RUBY",
  //   "RUST",
  //   "SCALA",
  //   "SCHEME",
  //   "SQL",
  //   "SWIFT",
  //   "TYPESCRIPT",
  //   "VISUALBASICNET",
  //   "ELIXIR",
  //   "ERLANG",
  // ];

  const [seniority, setSeniority] = useState([]);
  // const seniority = ["JUNIOR", "SEMISENIOR", "SENIOR"];

  /*   const companyType = ["STARTUP", "SMALL", "MEDIUM", "BIG", "MULTINATIONAL"];
   */

  const [specialization, setSpecialization] = useState([]);
  // const specialization = [
  //   "FRONTEND",
  //   "BACKEND",
  //   "FULLSTACK",
  //   "DATASCIENTIST",
  //   "AI_ENGINEER",
  // ];

  const [workday, setWorkdDay] = useState([]);
  // const workday = [
  //   "FULLTIME",
  //   "PARTTIME",
  //   "INTERMEDIATE",
  //   "TEMPORAL",
  //   "INTERSHIPTRAINEE",
  // ];

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('/api/vacancies');
      if (response) {
        const allVacancies = response.data;
        const languages = [];
        const seniorities = [];
        const specializations = [];
        const workdays = [];
        allVacancies.forEach((vacancy) => {
          vacancy.programming_Languages.forEach((language) => {
            if (!languages.includes(language)) {
              languages.push(language);
            }
          });
          if (!seniorities.includes(vacancy.seniority)) {
            seniorities.push(vacancy.seniority);
          }
          if (!specializations.includes(vacancy.name_Vacancy)) {
            specializations.push(vacancy.name_Vacancy);
          }
          if (!workdays.includes(vacancy.workday)) {
            workdays.push(vacancy.workday);
          }
        });
        setProgramming_Languages(languages);
        setSeniority(seniorities);
        setSpecialization(specializations);
        setWorkdDay(workdays);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={styles.allFilters}>
      <div className={styles.selectorsContainer}>
        <select
          onChange={(e) => setSelectedProgLanguage(e.target.value)}
          className={styles.selectors}
        >
          <option value="">-- select a language --</option>
          {programming_Languages.map((language, index) => (
            <option key={index} value={language}>
              {language}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedSeniority(e.target.value)}
          className={styles.selectors}
        >
          <option value="">-- select a seniority --</option>
          {seniority.map((seniority, index) => (
            <option key={index} value={seniority}>
              {seniority}
            </option>
          ))}
        </select>
        {/*     <select
          onChange={(e) => setSelectedCompanyType(e.target.value)}
          className={styles.selectors}
        >
          <option value="">-- select a company type -- </option>
          {companyType.map((companyType, index) => (
            <option key={index} value={companyType}>
              {companyType}
            </option>
          ))}
        </select> */}
      </div>
      <div className={styles.selectorsContainer}>
        <select
          onChange={(e) => setselectedNameVacancy(e.target.value)}
          className={styles.selectors}
        >
          <option value="">-- select a specialization --</option>
          {specialization.map((specialization, index) => (
            <option key={index} value={specialization}>
              {specialization}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedWorkday(e.target.value)}
          className={styles.selectors}
        >
          <option value="">-- select a workday --</option>
          {workday.map((workday, index) => (
            <option key={index} value={workday}>
              {workday}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FiltersSelectorProfile;
