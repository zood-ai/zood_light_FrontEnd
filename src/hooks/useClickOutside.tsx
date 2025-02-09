import { useCallback, useEffect } from "react";

const useClickOutside = ({ enabled, ref, cb }) => {
  const handleClickOutside = useCallback(
    (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        cb();
      }
    },
    [cb, ref]
  );

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handleClickOutside, enabled]);

  return null;
};

export default useClickOutside;
