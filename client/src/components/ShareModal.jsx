import React from "react";
import { IoIosClose } from "react-icons/io";
import styles from "../pages/styles/homepage.module.css";

const ShareModal = ({
  isOpen,
  closeModal,
  permissions,
  setPermissions,
  recipientEmail,
  setRecipientEmail,
  handleSharedDashboard,
}) => {
  return (
    isOpen && (
      <div className={styles.modalOverlay}>
        <div className={styles.shareSection}>
          <div className={styles.closeBtn}>
            <IoIosClose onClick={closeModal} className={styles.close} />
          </div>
          <div className={styles.Options}>
            <p className={styles.text}>Invite by Email</p>
            <select
              className={styles.select}
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>
          </div>
          <input
            className={styles.input}
            id="email"
            type="email"
            placeholder="enter email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
          <button className={styles.inviteBtn} onClick={handleSharedDashboard}>
            send invite
          </button>
          <p className={styles.text}>Invite by link</p>
          <button className={styles.inviteBtn} onClick={handleSharedDashboard}>
            copy link
          </button>
        </div>
      </div>
    )
  );
};

export default ShareModal;
