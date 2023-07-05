"use client";
import React, { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../layout";
import Header from "./DashSuperadmin/Elementos/Header";
import InfoCard from "./DashSuperadmin/Elementos/InfoCards";
import BarcharCompany from "./DashSuperadmin/Graficos/Companies/Barchar";
import Piechar from "./DashSuperadmin/Graficos/Vacancies/Piechar";
import styles from "./dashboard.module.css";
import CountryPieChart from "./DashSuperadmin/Graficos/countries/Countris";
import TableUsers from "./DashSuperadmin/Graficos/Table/table";
import TableCompanies from "./DashSuperadmin/Graficos/TableCompanies/table";
import TableVacancies from "./DashSuperadmin/Graficos/TableVacancies/table";
import MercadoPagoData from "./DashSuperadmin/Graficos/mercadoPago/mercadoPago";
import RevenueChart from "./DashSuperadmin/Graficos/mercadoPago/mercadoPagoGraph";
import { useState } from "react";
import axios from "axios";

function SuperDashboardAdmin() {
  const { jobs } = useContext(GlobalContext);

  const router = useRouter();
  const [userb, setUserb] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState(null);
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const usersResponse = axios.get("/api/users?includeInactive=true");
        const companiesResponse = axios.get(
          "/api/companies?includeInactive=true"
        );
        const [usersData, companiesData] = await Promise.all([
          usersResponse,
          companiesResponse,
        ]);
        setUsers(usersData.data);
        setCompanies(companiesData.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setUsers(null);
        setCompanies(null);
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users
    ? users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const filteredCompanies = companies
    ? companies.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const [accordionState, setAccordionState] = useState({
    ac1: true,
    ac2: false,
    ac3: false,
  });

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const userb = userData ? JSON.parse(userData) : null;
    setUserb(userb);

    if (!userb || !userb.superAdmin) {
      router.push("/access-denied");
    }
  }, []);

  const handleAccordionChange = (id) => {
    setAccordionState((prevState) => ({
      ...prevState,
      [id]: prevState[id] ? false : true,
    }));
  };

  return (
    <div className={styles.contenedorGeneral}>
      <Header />
      <div className={styles.dataContainer}>
        <div>
          {isLoading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.spinner}></div>
            </div>
          ) : (
            <>
              <InfoCard jobs={jobs} users={users} companies={companies} />
              <div className={styles.containerGraphAcc}>
                <div className={styles.containerGraph}>
                  <BarcharCompany
                    jobs={jobs}
                    users={users}
                    companies={companies}
                  />
                  <Piechar jobs={jobs} users={users} companies={companies} />
                  <CountryPieChart users={users} />
                </div>
                <div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className={styles.buscador}
                  />
                  <section className={styles.ac_container}>
                    <div>
                      <input
                        id="ac-1"
                        name="accordion-1"
                        type="radio"
                        checked={accordionState.ac1}
                        onChange={() => handleAccordionChange("ac1")}
                      />
                      <label htmlFor="ac-1">Users Table</label>
                      <article
                        className={`${styles.ac_small} ${
                          accordionState.ac1 ? styles.active : ""
                        }`}
                      >
                        <TableUsers users={filteredUsers} />
                      </article>
                    </div>
                    <div>
                      <input
                        id="ac-2"
                        name="accordion-1"
                        type="radio"
                        checked={accordionState.ac2}
                        onChange={() => handleAccordionChange("ac2")}
                      />
                      <label htmlFor="ac-2">Companies Table</label>
                      <article
                        className={`${styles.ac_medium} ${
                          accordionState.ac2 ? styles.active : ""
                        }`}
                      >
                        <TableCompanies companies={filteredCompanies} />
                      </article>
                    </div>
                    <div>
                      <input
                        id="ac-3"
                        name="accordion-1"
                        type="radio"
                        checked={accordionState.ac3}
                        onChange={() => handleAccordionChange("ac3")}
                      />
                      <label htmlFor="ac-3">Vacancies Table</label>
                      <article
                        className={`${styles.ac_large} ${
                          accordionState.ac3 ? styles.active : ""
                        }`}
                      >
                        <TableVacancies jobs={jobs} />
                      </article>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperDashboardAdmin;
