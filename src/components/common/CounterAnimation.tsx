import React from "react";
import { useSpring, animated } from "@react-spring/web";

interface CountAnimationProps {
  value: number;
}

const CountAnimation: React.FC<CountAnimationProps> = ({ value }) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: value },
    config: { duration: 1000 },
  });

  return <animated.div>{number.to((n) => Math.floor(n))}</animated.div>;
};

export default CountAnimation;
