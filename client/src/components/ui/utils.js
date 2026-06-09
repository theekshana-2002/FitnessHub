import React from "react";

export function resolveImageUrl(imageUrl = "") {
  if (!imageUrl) return "";
  return String(imageUrl).startsWith("http")
    ? imageUrl
    : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${imageUrl}`;
}

export function useSmallScreen(breakpoint = 640) {
  const getMatch = React.useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= breakpoint;
  }, [breakpoint]);

  const [isSmallScreen, setIsSmallScreen] = React.useState(getMatch);

  React.useEffect(() => {
    const onResize = () => setIsSmallScreen(getMatch());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [getMatch]);

  return isSmallScreen;
}
