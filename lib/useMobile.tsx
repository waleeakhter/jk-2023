// useScreenType.js
import { useState, useEffect } from "react";

const useScreenType = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenSize();

    // Event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return { isMobile };
};

export default useScreenType;

// hooks/useBodyScrollLock.js


