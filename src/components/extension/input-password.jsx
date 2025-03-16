import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function InputPassword({ className, ...rest }) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className={cn("relative", className)}>
      <Input type={showPassword ? "text" : "password"} {...rest} />
      <button
        type="button"
        onClick={togglePassword}
        className="absolute inset-y-0 right-0 flex items-center  pr-3"
        aria-label="Toggle password visibility"
        tabIndex="-1"
      >
        <motion.div
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{
            opacity: 1,
            rotate: showPassword ? 180 : 0,
          }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </motion.div>
      </button>
    </div>
  );
}
