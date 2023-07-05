import React, { useState } from "react";
import axios from "axios";
import ChatBot, { Loading } from "react-simple-chatbot";

function Chatbot(props) {
  const [loading, setLoading] = useState(false);
  const [jobType, setJobType] = useState("");
  const [seniority, setSeniority] = useState("");
  const [jobs, setJobs] = useState([]);

  const jobOptions = {
    "front-end developer": "FRONTEND",
    "back-end developer": "BACKEND",
    "data scientist": "DATASCIENTIST",
    "fullstack developer": "FULLSTACK",
    "ai engineer": "AI_ENGINEER",
  };

  const seniorityOptions = {
    junior: "JUNIOR",
    "semi-senior": "SEMISENIOR",
    senior: "SENIOR",
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/vacancies", {
        params: {
          name_Vacancy: Object.keys(jobOptions).find(
            (key) => jobOptions[key] === jobType.toUpperCase()
          ),
          seniority: Object.keys(seniorityOptions).find(
            (key) => seniorityOptions[key] === seniority.toUpperCase()
          ),
        },
      });

      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // console.log(jobs);

  if (loading) {
    return <Loading />;
  }

  return (
    <ChatBot
      headerTitle="IT Job Search Bot"
      recognitionEnable={true}
      steps={[
        {
          id: "1",
          message: "Shalom, what is your name?",
          trigger: "2",
        },
        {
          id: "2",
          user: true,
          trigger: "3",
        },
        {
          id: "3",
          message:
            "Nice to meet you, {previousValue}! What type of IT job are you looking for (FrontEnd, BackEnd, FullStack, Data Scientist, AI Engineer)?",
          trigger: "4",
        },
        {
          id: "4",
          user: true,
          validator: (value) => {
            const job = jobOptions[value.toLowerCase()];
            if (job) {
              setJobType(job);
              return true;
            }
            return false;
          },
          trigger: "5",
        },
        {
          id: "5",
          message:
            "Great! Could you tell me your level of expertise? (e.g. Junior, SemiSenior, Senior)",
          trigger: "6",
        },
        {
          id: "6",
          user: true,
          validator: (value) => {
            const level = seniorityOptions[value.toLowerCase()];
            if (level) {
              setSeniority(level);
              return true;
            }
            return false;
          },
          trigger: "7",
        },
        {
          id: "7",
          message:
            "Thank you. Let me find some {previousValue} {previousValue} jobs for you.",
          trigger: "8",
        },
        {
          id: "8",
          message: `I found ${jobs.length} job(s) that match your search.`,
          waitAction: true,
          end: true,
          onAfterUserAction: fetchJobs,
        },
      ]}
    />
  );
}

export default Chatbot;
