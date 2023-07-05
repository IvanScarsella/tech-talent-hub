import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import UserOfferCard from "../UserOfferCard/UserOfferCard";
import formatDate from "../../../../helpers/formatDate";
import UserOfferDetail from "../UserOfferDetail/UserOfferDetail";
import styles from "./UserOfferCardsContainer.module.css";

const UserOfferCardsContainerForDashboard = ({
  users,
  companyData,
  isLoading,
}) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (users && users.length > 0) {
      setSelectedUserId(users[0].id);
    }
  }, [users]);

  const onUserSelected = (id) => {
    setSelectedUserId(id);
    if (windowWidth <= 600) {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {isLoading || !users || !selectedUserId ? (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <div className={styles.contains}>
          <div className={styles.containerAll}>
            <div className={styles.scrollableList}>
              <ul className={styles.list}>
                {users.length > 0 ? (
                  <div className={styles.fixedBar}>
                    <span className={styles.allCandidates}>Candidates</span>
                  </div>
                ) : null}
                {users.map((user, index) => {
                  const formatStart = formatDate(user.start);
                  return (
                    <UserOfferCard
                      key={index}
                      id={user.id}
                      name={user.name}
                      lastname={user.lastname}
                      progLanguages={user.progLanguages}
                      onUserSelected={onUserSelected}
                    />
                  );
                })}
              </ul>
            </div>
            {windowWidth > 600 && (
              <div className={styles.detail}>
                <UserOfferDetail
                  selectedUserId={selectedUserId}
                  users={users}
                  companyData={companyData}
                  setSelectedUserId={setSelectedUserId}
                />
              </div>
            )}
            {isModalOpen && (
              <ReactModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="User Details"
                className={styles.modal}
                style={{
                  overlay: {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backdropFilter: "blur(5px)", // Añade desenfoque
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Oscurece el fondo
                  },
                  content: {
                    animationName: "slideInUp", // Aplica la animación
                    animationDuration: "0.5s", // Configura la duración de la animación
                    height: "auto",
                    marginTop: 50,
                  },
                }}
              >
                <button className={styles.closeButton} onClick={closeModal}>
                  X
                </button>
                <UserOfferDetail
                  selectedUserId={selectedUserId}
                  users={users}
                  companyData={companyData}
                  setSelectedUserId={setSelectedUserId}
                  className={styles.userDetail}
                />
              </ReactModal>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserOfferCardsContainerForDashboard;
