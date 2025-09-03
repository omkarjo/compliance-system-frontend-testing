/**
 * AnimateChangeInHeight.jsx
 *
 * Animates height changes of its child content using motion/react.
 * Useful for popovers or dropdowns where content height may change.
 *
 * Usage:
 * <AnimateChangeInHeight>
 *   {children}
 * </AnimateChangeInHeight>
 */

import { motion } from "motion/react";
import React from "react";

const AnimateChangeInHeight = ({ children }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        layout: { duration: 0.2, ease: "easeInOut" },
        opacity: { duration: 0.14, ease: "easeInOut" },
      }}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimateChangeInHeight;