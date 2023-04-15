// While playing around with a gradient generator I found that a white section sweeping from position 0% to 100% sandwiched between gray sections fixed at 0% and 100% looked kind of like a sci-fi scan effect. Hard to explain, but if you check it out you'll see what I mean. I was thinking about implementing it after a user hits search, so it looks like it's "scanning" for player data. I realize now that it's way probably too much for an API website and I was just trying to shoehorn it in cause I thought it was cool. I'm gonna leave it here so you can check it out, maybe we can implement it in a less obtrusive way, maybe I just make a repo on my GH out of it.
// to check out:
//    - App.tsx:
//      - replace <> w/ <BackgroundAnimation>  (commented out right below <>)
//      - remove comment tag from BackgroundAnimation import statement

import "./stylesheets/BackgroundAnimation.css";
import { useEffect } from "react";

interface BackgroundAnimationProps {
  children: React.ReactNode;
}

function BackgroundAnimation({ children }: BackgroundAnimationProps) {
  const generateKeyframes = () => {
    let keyframes = "";

    for (let i = 0; i <= 100; i++) {
      keyframes += `
      ${i}% {
        background: linear-gradient(90deg, rgba(100,100,106,1) 0%, rgba(253,253,255,0.95) ${i}%, rgba(100,100,96,1) 100%);
      }`;
    }

    return keyframes;
  };

  useEffect(() => {
    const keyframesElement = document.createElement("style");
    keyframesElement.id = "gradient-keyframes";
    keyframesElement.innerHTML = `
    @keyframes gradientAnimation {
      ${generateKeyframes()}
    }
    `;

    document.head.appendChild(keyframesElement);

    return () => {
      document.head.removeChild(keyframesElement);
    };
  }, []);

  return <div className="background-animation">{children}</div>;
}

export default BackgroundAnimation;
