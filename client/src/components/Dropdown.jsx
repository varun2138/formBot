import React from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import styles from "../pages/styles/homepage.module.css";

const Dropdown = ({
  isDropdownOpen,
  toggleDropdown,
  user,
  sharedDashboards,
  handleSharedUserClick,
}) => {
  return (
    <div className={styles.dropdown}>
      <button
        onClick={toggleDropdown}
        className={`${styles.dropdownButton} ${
          isDropdownOpen ? styles.open : ""
        }`}
      >
        <Link to="/dashboard" className={styles.dropdownItem}>
          {user.username}'s Workspace
          {isDropdownOpen ? (
            <MdKeyboardArrowDown className={styles.icon} />
          ) : (
            <MdKeyboardArrowUp className={styles.icon} />
          )}
        </Link>
      </button>

      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>
          <button
            className={styles.dropdownItem}
            onClick={() => handleSharedUserClick(user?._id)}
          >
            {user.username}'s Workspace
          </button>
          {sharedDashboards.length > 0 &&
            sharedDashboards.map((dashboard) => (
              <button
                className={styles.dropdownItem}
                onClick={() => handleSharedUserClick(dashboard.id)}
                key={dashboard.id}
              >
                {dashboard.name}'s workspace
              </button>
            ))}
          <Link to="/settings" className={styles.settings}>
            Settings
          </Link>
          <button className={styles.logout}>Log Out</button>
        </div>
      )}
    </div>
  );
};

export default Dropdown;