import { primary_color } from "@/assets/colors";
import { useEffect } from "react";
import TopBarProgress from "react-topbar-progress-indicator";

export const TopBarLoadingComp = () => {
  useEffect(() => {
    TopBarProgress.config({
      barColors: {
        "0": primary_color,
        "1.0": primary_color,
      },
      shadowBlur: 5,
      barThickness: 2,
    });
  }, []);

  return (
    <div>
      <TopBarProgress />
    </div>
  );
};
