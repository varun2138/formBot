import React from "react";
import styles from "./styles/sidebar.module.css";

import { BiText } from "react-icons/bi";
import { LuHash } from "react-icons/lu";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { MdDateRange } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { TbCheckbox } from "react-icons/tb";
import { LuMessageSquareText } from "react-icons/lu";
import { CiImageOn } from "react-icons/ci";

const iconMap = {
  "text-icon": <BiText />,
  "number-icon": <LuHash />,
  "email-icon": <MdOutlineAlternateEmail />,
  "phone-icon": <FiPhone />,
  "date-icon": <MdDateRange />,
  "rating-icon": <FaRegStar />,
  "button-icon": <TbCheckbox />,
  "text-bubble-icon": <LuMessageSquareText />,
  "image-bubble-icon": <CiImageOn />,
};

const Sidebar = ({ onFieldAdd }) => {
  const fieldTypes = [
    {
      name: "Text",
      type: "input",
      inputType: "text",
      subtype: "text",
      placeholder: "Enter your text",
      logo: "text-icon",
    },
    {
      name: "Number",
      type: "input",
      inputType: "number",
      subtype: "number",
      placeholder: "Enter a number",
      logo: "number-icon",
    },
    {
      name: "Email",
      type: "input",
      inputType: "email",
      subtype: "email",
      placeholder: "Enter your email",
      logo: "email-icon",
    },
    {
      name: "Phone",
      type: "input",
      inputType: "number",
      subtype: "number",
      placeholder: "Enter your phone",
      logo: "phone-icon",
    },
    {
      name: "Date",
      type: "input",
      inputType: "date",
      subtype: "date",
      placeholder: "Select a date",
      logo: "date-icon",
    },
    {
      name: "Rating",
      type: "input",
      inputType: "rating",
      subtype: "rating",
      placeholder: "",
      logo: "rating-icon",
    },
    {
      name: "Buttons",
      type: "input",
      inputType: "button",
      subtype: "button",
      placeholder: "Submit form",
      logo: "button-icon",
    },
  ];

  const Bubblefields = [
    {
      name: "Text",
      type: "bubble",
      subtype: "text",
      logo: "text-bubble-icon",
    },
    {
      name: "Image",
      type: "bubble",
      subtype: "image",
      logo: "image-bubble-icon",
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.bubbles}>
        <p>Bubbles</p>
        <div className={styles.data}>
          {Bubblefields.map((field, index) => (
            <div
              key={index}
              className={styles.fieldItem}
              onClick={() => onFieldAdd(field)}
            >
              <div className={styles.icon}>{iconMap[field.logo]}</div>
              {field.name}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.Inputs}>
        <p>Inputs</p>
        <div className={styles.data}>
          {fieldTypes.map((field, index) => (
            <div
              key={index}
              className={styles.fieldItem}
              onClick={() => onFieldAdd(field)}
            >
              <div className={styles.inputIcon}>{iconMap[field.logo]}</div>
              {field.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
