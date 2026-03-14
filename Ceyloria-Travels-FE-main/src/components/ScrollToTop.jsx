import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // instantly scroll to top without smooth animation
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto", // instant jump
    });
  }, [pathname]);

  return null;
}
