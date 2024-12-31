import React from "react";
import styles from "./styles/mainpage.module.css";
import { useNavigate } from "react-router-dom";
import {
  RiExternalLinkLine,
  curve,
  triangle,
  logo,
  image,
} from "../utils/icons";
import sections from "../utils/data";

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <img src={logo} alt="logo" />

        <div className={styles.buttons}>
          <button
            onClick={() => navigate("/formpage")}
            className={styles.signIn}
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/formpage")}
            className={styles.create}
          >
            {" "}
            Create a FormBot
          </button>
        </div>
      </nav>
      <div className={styles.heading}>
        <h1 className={styles.title}>Build advanced chatbots visually</h1>
        <p className={styles.text}>
          Typebot gives you powerful blocks to create unique chat experiences.
          Embed them anywhere on your web/mobile apps and start collecting
          results like magic.
        </p>
        <button
          onClick={() => navigate("/formpage")}
          className={styles.formbot}
        >
          Create a FormBot for free
        </button>

        <img className={styles.triangle} src={triangle} alt="" />
        <img className={styles.curve} src={curve} alt="" />
      </div>

      <div className={styles.banner}>
        <img src={image} alt="" />
      </div>

      <footer className={styles.footer}>
        <div className={styles.section}>
          <img src={logo} alt="logo" />
          <p className={styles.company}>
            Made with ❤️ by <span className={styles.item}>@cuvette</span>
          </p>
        </div>
        {Object.entries(sections).map(([sectionName, items]) => (
          <div className={styles.section} key={sectionName}>
            <h2>{sectionName}</h2>
            <div className={styles.items}>
              {items.map((item, index) => (
                <p className={styles.item} key={index}>
                  {item.name} {item.external && <RiExternalLinkLine />}
                </p>
              ))}{" "}
            </div>
          </div>
        ))}
      </footer>
    </div>
  );
};

export default MainPage;
