import warriorImage from "./images/1.gif";
import paladinImage from "./images/2.gif";
import hunterImage from "./images/3.gif";
import rogueImage from "./images/4.gif";
import priestImage from "./images/5.gif";
import deathknightImage from "./images/6.gif";
import shamanImage from "./images/7.gif";
import mageImage from "./images/8.gif";
import warlockImage from "./images/9.gif";
import druidImage from "./images/11.gif";
import { ReactNode } from "react";

interface Images {
  [index: string]: ReactNode;
}

const images: Images = {
  warrior: <img src={warriorImage} alt="warrior"></img>,
  paladin: <img src={paladinImage} alt="paladin"></img>,
  hunter: <img src={hunterImage} alt="warrior"></img>,
  rogue: <img src={rogueImage} alt="rogue"></img>,
  priest: <img src={priestImage} alt="priest"></img>,
  deathknight: <img src={deathknightImage} alt="deathknight"></img>,
  shaman: <img src={shamanImage} alt="shaman"></img>,
  mage: <img src={mageImage} alt="mage"></img>,
  warlock: <img src={warlockImage} alt="warlock"></img>,
  druid: <img src={druidImage} alt="druid"></img>,
};

interface Props {
  comp: string;
}
export function CompImages(props: Props) {
  const split = props.comp.split("/");
  return (
    <span>{split.map((wowClass) => images[wowClass as keyof Images])}</span>
  );
}
