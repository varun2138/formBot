import React from "react";
import styles from "./styles/mainpage.module.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Container.png";
import { RiExternalLinkLine } from "react-icons/ri";
import image from "../assets/image.png";
import triangle from "../assets/triangle.png";
import curve from "../assets/curve.png";

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
        <div className={styles.section}>
          <h2>Product</h2>
          <div className={styles.items}>
            <p className={styles.item}>
              Status <RiExternalLinkLine />
            </p>
            <p className={styles.item}>
              Documentation <RiExternalLinkLine />
            </p>
            <p className={styles.item}>
              Roadmap <RiExternalLinkLine />
            </p>
            <p className={styles.item}>Pricing</p>
          </div>
        </div>
        <div className={styles.section}>
          <h2>Community</h2>
          <div className={styles.items}>
            <p className={styles.item}>
              Discord <RiExternalLinkLine />
            </p>
            <p className={styles.item}>
              GitHub repository <RiExternalLinkLine />
            </p>
            <p className={styles.item}>
              Twitter <RiExternalLinkLine />
            </p>
            <p className={styles.item}>
              Linkedin <RiExternalLinkLine />
            </p>
            <p className={styles.item}>OSS Friends </p>
          </div>
        </div>
        <div className={styles.section}>
          <h2>Company</h2>
          <div className={styles.items}>
            <p className={styles.item}>About </p>
            <p className={styles.item}>Contact </p>

            <p className={styles.item}>Terms of Service </p>
            <p className={styles.item}>Privacy Policy </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
