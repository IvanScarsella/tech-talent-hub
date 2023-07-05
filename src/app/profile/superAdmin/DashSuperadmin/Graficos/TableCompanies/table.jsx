"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./table.module.css";

function TableCompanies({ companies }) {
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCompanies, setFilteredCompanies] = useState(companies);
  const [usersPerPage] = useState(8);

  useEffect(() => {
    const sortedCompanies = Object.values(companies).sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setFilteredCompanies(sortedCompanies);
  }, [companies, sortConfig]);

  const updateCompanyStatus = (companyId, isActive) => {
    setFilteredCompanies((prevCompanies) => {
      const updatedCompanies = prevCompanies.map((company) => {
        if (company.id === companyId) {
          return { ...company, isActive };
        }
        return company;
      });
      return updatedCompanies;
    });
  };

  async function toggleActive(companyId, currentStatus) {
    try {
      const response = await axios.patch(`/api/companies/${companyId}`, {
        isActive: !currentStatus,
      });
      // console.log(response.data);
      updateCompanyStatus(companyId, !currentStatus);
    } catch (error) {
      console.error(error);
    }
  }

  const indexOfLastCompany = currentPage * usersPerPage;
  const indexOfFirstCompany = indexOfLastCompany - usersPerPage;
  const currentCompanies = filteredCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredCompanies.length / usersPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th} onClick={() => requestSort("name")}>
              Name
            </th>
            <th className={styles.th} onClick={() => requestSort("email")}>
              Email
            </th>
            <th className={styles.th} onClick={() => requestSort("country")}>
              Country
            </th>
            <th className={styles.th} onClick={() => requestSort("type")}>
              Company Type
            </th>
            <th className={styles.th} onClick={() => requestSort("isPremium")}>
              Is Premium
            </th>
            <th>Activate/Deactivate Company</th>
          </tr>
        </thead>
        <tbody>
          {currentCompanies.map((company) => (
            <tr key={company.id} className={styles.tr}>
              <td className={styles.td}>{company.name}</td>
              <td className={styles.td}>{company.email}</td>
              <td className={styles.td}>{company.country}</td>
              <td className={styles.td}>{company.type}</td>
              <td className={styles.td}>{company.isPremium ? "Yes" : "No"}</td>
              <td className={styles.td}>
                <button
                  onClick={() => toggleActive(company.id, company.isActive)}
                  className={styles.buttonActivation}
                >
                  {company.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>{" "}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.numberPaginationContainer}>
        {pageNumbers.map((number) => (
          <button
            onClick={() => paginate(number)}
            key={number}
            className={styles.numberButtons}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TableCompanies;
