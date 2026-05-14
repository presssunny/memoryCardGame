import react from "../assets/devtools/react.svg";
import git from "../assets/devtools/git.svg";
import linux from "../assets/devtools/linux.svg";
import docker from "../assets/devtools/docker.svg";
import mysql from "../assets/devtools/mysql.svg";
import figma from "../assets/devtools/figma.svg";
import tailwindcss from "../assets/devtools/tailwindcss.svg";
import javascript from "../assets/devtools/javascript.svg";

import char1 from "../assets/gabby/1.jpg";
import char2 from "../assets/gabby/2.jpg";
import char4 from "../assets/gabby/4.jpg";
import char5 from "../assets/gabby/5.jpg";
import charImages from "../assets/gabby/images.jpg";
import charImages7 from "../assets/gabby/images7.jpg";
import charUntitled from "../assets/gabby/Untitled.jpg";

// To add a new theme: append one object here with a unique id, label, cardBack color,
// and an icons array. Then add a .theme--{id} CSS block in index.css.
export const THEMES = [
  {
    id: "devtools",
    label: "Dev Tools",
    cardBack: "#0f172a",
    icons: [react, git, linux, docker, mysql, figma, tailwindcss, javascript],
  },
  {
    id: "gabby",
    label: "Gabby's Dollhouse",
    cardBack: "#fce4ec",
    icons: [char1, char2, char4, char5, charImages, charImages7, charUntitled],
  },
];

export const DEFAULT_THEME_ID = "devtools";
