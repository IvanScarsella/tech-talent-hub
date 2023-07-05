"use client";

import SearchBar from "../../components/generalComponents/SearchBar/searchBar";
import JobsOfferCardsContainerForHome from "../../components/jobsComponents/JobsOfferCardsComponents/JobsOfferCardsContainerForHomePage/JobsOfferCardsContainerForHomePage";
import styles from "./homePage.module.css";
import React, { useContext } from "react";
import { GlobalContext } from "../layout";
import { getLayout } from "../layout";
import FiltersSelectorProfile from "../../components/SelectorFiltersForProfiles/Selectors";
import { useEffect } from "react";
import Link from "next/link";
import Hi from "../../components/hi/hiUsers";

function HomePage() {
  const {
    jobs,
    isLoading,
    user,
    setSelectedProgLanguage,
    setSelectedSeniority,
    setselectedNameVacancy,
    setSelectedWorkday,
    setSearchValue,
    setUser,
  } = useContext(GlobalContext);

  useEffect(() => {
    const localStorageData = localStorage.getItem("userData");
    const userData = JSON.parse(localStorageData);
    setUser(userData);
  }, []); // Dependency array

  return (
    <div className={styles.globalContainer}>
      <div className={styles.tituloContenedor}>
        {user && <Hi user={user} />}
        <SearchBar setSearchValue={setSearchValue} /> <br />
        {user && user.superAdmin && (
          <div className={styles.contenedorBoton}>
            <Link href={"./superAdmin"}>
              <button className={styles.superAdminButton}>
                Admin Dashboard{" "}
              </button>
            </Link>
          </div>
        )}
      </div>
      <FiltersSelectorProfile
        setSelectedProgLanguage={setSelectedProgLanguage}
        setSelectedSeniority={setSelectedSeniority}
        setselectedNameVacancy={setselectedNameVacancy}
        setSelectedWorkday={setSelectedWorkday}
      />
      <br />
      {!isLoading ? (
        jobs.filter((job) => job.isActive).length > 0 ? (
          <div className={styles.contenedorPadre}>
            <div className={styles.forniculo}>
              <div className={styles.jobsContainer}>
                <JobsOfferCardsContainerForHome jobs={jobs} user={user} />
                <div className={styles.jobsDetailContainer} />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.loaderContainer}>
            <h4>
              Sorry, we did not find any information with the given parameters.
            </h4>
          </div>
        )
      ) : (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner} />
          <div>
            <h4>Just a moment while we upload the information...</h4>
          </div>
        </div>
      )}
    </div>
  );
}
HomePage.getLayout = getLayout;

export default HomePage;
