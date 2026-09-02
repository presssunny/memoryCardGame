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

import { picSrc } from "../assets/kids/registry";

// The Emoji theme reuses the shared Kids picture library (Twemoji, CC-BY 4.0 —
// see src/assets/kids/README.md). It carries 16 icons, so it's the one that
// makes a "Hard" (12-pair) Memory Match board possible.
const EMOJI_ICONS = [
  "lion", "fox", "panda", "owl", "frog", "penguin", "unicorn", "turtle",
  "apple", "strawberry", "pizza", "cookie", "rocket", "guitar", "star", "balloon",
].map(picSrc);

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
    id: "emoji",
    label: "Emoji",
    cardBack: "#0f172a",
    icons: EMOJI_ICONS,
  },
  {
    id: "gabby",
    label: "Gabby's Dollhouse",
    cardBack: "#fce4ec",
    icons: [char1, char2, char4, char5, charImages, charImages7, charUntitled],
  },
];

export const DEFAULT_THEME_ID = "devtools";
