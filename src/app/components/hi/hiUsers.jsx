import React from "react";
import styles from "./hi.module.css";

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function Hi({ user }) {
  const name = toTitleCase(user.name);
  // console.log(name);
  return (
    <div>
      <a href="./mydata" className={styles.nstyle}>
        <h1 className={styles.h1}>Hi {name}!</h1>
      </a>
    </div>
  );
}

export default Hi;
