import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./SelectorFiltersForCompanyDashboard.module.css";

const FiltersSelector = ({
  setSelectedProgLanguage,
  setSelectedSeniority,
  setSelectedSoftSkill,
  setSelectedSpecialization,
}) => {

  const [progLanguages, setProgLanguages] = useState([]);
  // let progLanguages = [
    // "C",
    // "GO",
    // "JAVA",
    // "JAVASCRIPT",
    // "KOTLIN",
    // "R",
    // "OBJECTIVEC",
    // "PHP",
    // "POSTSCRIPT",
    // "PYTHON",
    // "REACT",
    // "RUBY",
    // "RUST",
    // "SCALA",
    // "SCHEME",
    // "SQL",
    // "SWIFT",
    // "TYPESCRIPT",
    // "VISUALBASICNET",
    // "ELIXIR",
    // "ERLANG",
  // ];

  const [seniority, setSeniority] = useState([]);
  // const seniority = [
    // "JUNIOR",
    // "SEMISENIOR",
    // "SENIOR"
  // ];

  const [ softSkills, setSoftSkills] = useState([]);
  // const softSkills = [
    // "Optimism",
    // "Adaptability",
    // "Communication",
    // "Teamwork",
    // "Problem_Solving",
    // "Time_Management",
    // "Critical_Thinking",
    // "Decision_Making",
    // "Organizational",
    // "Stress_Management",
    // "Attention_To_Detail",
    // "Conflict_Management",
    // "Leadership",
    // "Creativity",
    // "Resourcefulness",
    // "Persuasion",
    // "Openness_To_Criticism",
    // "Interpersonal_Skills",
    // "Work_Ethic",
    // "Self_Motivation",
    // "Collaboration",
  // ];

  const [ specialization, setSpecialization] = useState([]);
  // const specialization = [
    // "FRONTEND",
    // "BACKEND",
    // "FULLSTACK",
    // "DATASCIENTIST",
    // "AI_ENGINEER",
  // ];

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('/api/users');
      if (response) {
        const allUsers = response.data;
        const languages = [];
        const seniorities = [];
        const softSkills = [];
        const specializations = [];
        allUsers.forEach((user) => {
          user.progLanguages.forEach((language) => {
            if (!languages.includes(language)) {
              languages.push(language);
            }
          });
            if (!seniorities.includes(user.seniority)) {
              seniorities.push(user.seniority);
            }
          user.softSkills.forEach((skill) => {
            if (!softSkills.includes(skill)) {
              softSkills.push(skill);
            }
          });
            if (!specializations.includes(user.specialization)) {
              specializations.push(user.specialization);
            }
        });
        setProgLanguages(languages);
        setSeniority(seniorities);
        setSoftSkills(softSkills);
        setSpecialization(specializations);
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
          {progLanguages.map((language, index) => (
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
      </div>
      <div className={styles.selectorsContainer}>
        <select
          onChange={(e) => setSelectedSoftSkill(e.target.value)}
          className={styles.selectors}
        >
          <option value="">-- select a soft skill --</option>
          {softSkills.map((softSkill, index) => (
            <option key={index} value={softSkill}>
              {softSkill}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedSpecialization(e.target.value)}
          className={styles.selectors}
        >
          <option value="">-- select a specialization --</option>
          {specialization.map((specialization, index) => (
            <option key={index} value={specialization}>
              {specialization}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FiltersSelector;
