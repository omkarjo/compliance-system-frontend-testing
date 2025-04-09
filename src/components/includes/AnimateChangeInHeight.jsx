import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AnimateChangeInHeight = ({ children, className }) => {
  const containerRef = useRef(null);
  const [height, setHeight] = useState("auto");

  useEffect(() => {
    if (!containerRef.current) return;

    const updateHeight = () => {
      if (containerRef.current) {
        const measuredHeight = containerRef.current.scrollHeight;
        setHeight(measuredHeight + 2);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(containerRef.current);

    window.addEventListener("load", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("load", updateHeight);
    };
  }, []);

  return (
    <motion.div
      className={cn(className, "overflow-hidden")}
      style={{ height }}
      animate={{ height }}
      transition={{ duration: 0.1, damping: 0.2, ease: "easeIn" }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
};

export default AnimateChangeInHeight;
