"use client";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const GlobalContext = createContext();

export default function Layout({ children }) {
  const [dataUsers, setDataUsers] = useState([]);
  const [dataCompanies, setDataCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProgLanguage, setSelectedProgLanguage] = useState("");
  const [selectedSeniority, setSelectedSeniority] = useState("");
  const [selectedSoftSkill, setSelectedSoftSkill] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/users");
      setDataUsers(response.data);
      setUsers(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await axios.get("/api/companies");
      setDataCompanies(response.data);
      setCompanies(response.data);
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchSearchUsers = async () => {
      const response = await axios.get(`/api/searchUsers?q=${searchValue}`);
      setUsers(response.data);
    };
    fetchSearchUsers();
  }, [searchValue]);

  useEffect(() => {
    const fetchFilteredUsers = async () => {
      const url = "/api/usersFilters";
      const params = {};

      if (selectedProgLanguage) {
        params.progLanguage = selectedProgLanguage;
      }

      if (selectedSeniority) {
        params.seniority = selectedSeniority;
      }

      if (selectedSoftSkill) {
        params.softSkill = selectedSoftSkill;
      }

      try {
        const response = await axios.get(url, { params });
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    selectedProgLanguage || selectedSeniority || selectedSoftSkill
      ? fetchFilteredUsers()
      : setUsers(dataUsers);
  }, [selectedProgLanguage, selectedSeniority, selectedSoftSkill]);

  return (
    <GlobalContext.Provider
      value={{
        users,
        setSelectedProgLanguage,
        setSelectedSeniority,
        setSelectedSoftSkill,
        setSearchValue,
        setCompanies,
        companies,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function getLayout(page) {
  return <Layout>{page}</Layout>;
}