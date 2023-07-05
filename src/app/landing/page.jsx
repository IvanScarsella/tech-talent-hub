"use client";
import Services from "../services/page";
import JobsLanding from "../jobs/page";
import LandingFirstPart from "../components/landing/Landing";
import styles from "./landing.module.css";
import Carrousel from "../components/carrouselCompanies/carrousel";
import AboutProject from "../components/aboutProject/aboutProject";
import Chatbot from "../chatBot/chatbot";
import { useEffect, useState } from "react";
function Landing(props) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);

    if (typeof window !== "undefined") {
      checkMobile();
      window.addEventListener("resize", checkMobile);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", checkMobile);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <LandingFirstPart />
      <AboutProject />
      {isMobile ? null : <Carrousel className={styles.logos} />}
      <JobsLanding section="landing" />
      <Services section="landing" alignCenter={false} />
    </div>
  );
}

export default Landing;
