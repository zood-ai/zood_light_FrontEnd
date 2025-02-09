import { useMemo } from "react";

const useAvatar = (name: string) => {
  const initials = useMemo(() => {
    const nameParts = name?.split(" ").filter((part) => part.length > 0);

    const getInitial = (part: string) => {
      const initial = part?.[0].toUpperCase();

      if (/[^a-zA-Z]/.test(initial)) {
        return part.length > 1 ? part[1].toUpperCase() : "";
      }
      return initial;
    };

    if (nameParts?.length === 1) {
      return getInitial(nameParts?.[0]);
    } else {
      const firstPart = nameParts?.[0];
      const lastPart = nameParts?.[nameParts?.length - 1];

      const firstInitial = getInitial(firstPart);
      const lastInitial = getInitial(lastPart);

      return (firstInitial + lastInitial)?.slice(0, 2);
    }
  }, [name]);

  return initials;
};

export default useAvatar;
