import { useEffect, useState } from "react";

export const useIsCookieDisabled = () => {
  const [isCookieDisabled, setIsCookieDisabled] = useState(false);
  useEffect(() => {
    if (window.navigator.cookieEnabled) return;
    setIsCookieDisabled(true);
  }, []);

  return [isCookieDisabled];
};
