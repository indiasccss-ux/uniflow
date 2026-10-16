import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  delay?: number;
  index?: number;
  className?: string;
  children: React.ReactNode;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  delay,
  index = 0,
  className = '',
  children,
  ...props
}) => {
  const calculatedDelay = delay !== undefined ? delay : Math.min(index * 0.08, 0.65);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: 'blur(10px)', scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: true, amount: 0.08, margin: '0px 0px -30px 0px' }}
      transition={{
        duration: 0.75,
        delay: calculatedDelay,
        ease: [0.16, 1, 0.3, 1], // Apple VisionOS luxury spring curve
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
