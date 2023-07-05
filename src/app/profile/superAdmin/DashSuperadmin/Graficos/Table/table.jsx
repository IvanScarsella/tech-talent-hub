"use client";

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./table.module.css";

function TableUsers({ users }) {
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "ascending",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users || []);

  useEffect(() => {
    let results = users || [];

    if (searchTerm) {
      results = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCurrentPage(1); // reset the page number
    }

    results.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setFilteredUsers(results);
  }, [searchTerm, users, sortConfig]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //? UPDATE USER STATUS
  const updateUserStatus = (userId, isActive) => {
    setFilteredUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) => {
        if (user.id === userId) {
          return { ...user, isActive };
        }
        return user;
      });
      return updatedUsers;
    });
  };

  async function toggleActive(userId, currentStatus) {
    try {
      const response = await axios.patch(`/api/users/${userId}`, {
        isActive: !currentStatus, // invertir el estado actual
      });
      // console.log(response.data);
      updateUserStatus(userId, !currentStatus);
    } catch (error) {
      console.error(error);
    }
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers
    ? filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ width: "200px", height: "20px", background: "red" }} // Add this line
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th} onClick={() => requestSort("username")}>
              Username
            </th>
            <th className={styles.th} onClick={() => requestSort("name")}>
              Name
            </th>
            <th className={styles.th} onClick={() => requestSort("lastname")}>
              Lastname
            </th>
            <th className={styles.th} onClick={() => requestSort("email")}>
              Email
            </th>
            <th className={styles.th} onClick={() => requestSort("country")}>
              Country
            </th>
            <th className={styles.th} onClick={() => requestSort("cv")}>
              cv
            </th>
            <th className={styles.th} onClick={() => requestSort("seniority")}>
              seniority
            </th>
            <th className={styles.th} onClick={() => requestSort("isPremium")}>
              Is Premium
            </th>
            <th>Delete User</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id} className={styles.tr}>
              <td className={styles.td}>{user.username}</td>
              <td className={styles.td}>{user.name}</td>
              <td className={styles.td}>{user.lastname}</td>
              <td className={styles.td}>{user.email}</td>
              <td className={styles.td}>{user.country}</td>
              <td className={styles.td}>
                <a href={user.cv} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              </td>
              <td className={styles.td}>{user.seniority}</td>
              <td className={styles.td}>{user.isPremium ? "Yes" : "No"}</td>
              <td className={styles.td}>
                <button
                  onClick={() => toggleActive(user.id, user.isActive)}
                  className={styles.buttonActivation}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
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

export default TableUsers;
