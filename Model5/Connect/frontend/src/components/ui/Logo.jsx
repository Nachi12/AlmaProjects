import { Link } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";

const Logo = ({ className = "", size = "md", showText = true }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <Link to="/" className={`flex items-center gap-3 group ${className}`}>
      <motion.div
        className={`relative ${sizeClasses[size]}  rounded-xl flex items-center justify-center `}
        
      >
       
        <img src="/favicon.ico" alt=""/>
        <div className="absolute inset-0  rounded-xl" />
        <motion.div
          className="absolute rounded-xl"
         
        />
      </motion.div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSizeClasses[size]} bg-gradient-primary bg-clip-text text-[#2993FB]`}>
            connect
          </span>
          <span className="text-xs text-muted-foreground -mt-1">
            Interview Excellence
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;