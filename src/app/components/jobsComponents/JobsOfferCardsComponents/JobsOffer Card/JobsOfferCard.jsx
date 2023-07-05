import React from "react";
import Image from "next/image";
import styles from "./JobsOfferCard.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
const JobsOfferCard = ({
  id,
  company,
  name_Vacancy,
  seniority,
  applicants,
  showButton,
  createdAt,
  showSpan,
  onJobSelected,
  logo_Company,
  salary,
  status,
  isActive,
  // section,
  showFinishButton, // Nueva prop
  onFinishProcess, // Manejador del evento Finish Process
  onApplicantsClick, // Agregamos esto para tener acceso a la prop
}) => {
  const handleClick = () => {
    if (id) {
      onFinishProcess(id);
    }
  };
  const pathname = usePathname();
  return (
    <div
      className={
        !pathname.includes("my-applications")
          ? styles.Container
          : styles.ContainerB
      }
      key={id}
      onClick={() => onJobSelected(id)}
    >
      <div className={styles.InfoContainer}>
        <div className={styles.CompanyNameContainer}>
          {/* {section && (

            <Image src={logo_Company} alt="company_logo" className={styles.company_logo} width={100} height={100} />
          )} */}
          {/* {!section && */}
          <span className={styles.span}>{company}</span>
          {/* //  */}
        </div>
        <h1 className={styles.CompanyTitle}> {name_Vacancy} </h1>
        <span className={styles.spanSeniority}> {seniority} </span>
      </div>
      {showButton && (
        <div className={styles.contenedorButton}>
          <Link href={`/loginpro`}>
            <button className={styles.button}>Apply</button>
          </Link>
        </div>
      )}
      {showSpan && (
        <div className={styles.contenedorSpan}>
          <span>{createdAt}</span>
        </div>
      )}
      <div className={styles.contenedorMyApplications}>
        <div className={styles.myapps} onClick={onApplicantsClick}>
          {applicants}
        </div>
        <span> {status}</span>
      </div>
      {showFinishButton && (
        <button onClick={handleClick} className={styles.button_finish}>
          {isActive ? "Finish Process" : "Finish Selection"}
        </button>
      )}{" "}
      {/* Verifica si se debe mostrar el botón */}
    </div>
  );
};

export default JobsOfferCard;
