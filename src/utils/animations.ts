import { withSpring, withTiming, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

export const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 1,
  stiffness: 200,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

export const timingConfig: WithTimingConfig = {
  duration: 300,
  easing: (x: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
};

export const listItemAnimationConfig: WithSpringConfig = {
  ...springConfig,
  damping: 12,
  mass: 0.9,
  stiffness: 180,
};

export const fadeInAnimation = (delay = 0) => {
  'worklet';
  return {
    initialValues: {
      opacity: 0,
      transform: [{ translateY: 20 }],
    },
    animations: {
      opacity: withTiming(1, { ...timingConfig, duration: 400, delay }),
      transform: [{ translateY: withSpring(0, { ...springConfig, delay }) }],
    },
  };
};

export const pressAnimation = (scale: number) => {
  'worklet';
  return {
    transform: [{ scale: withSpring(scale, springConfig) }],
  };
}; 