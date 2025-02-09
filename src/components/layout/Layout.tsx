import { ReactNode, Suspense } from "react";

// components
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import { TopBarLoadingComp } from "../ui/topbar-loading";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={`grid grid-cols-[64px_3fr] relative `}>
      <div className={`side-bar`}>
        <SideBar />
      </div>
      <div className="col-[2_/_span_12]">
        <NavBar />
        <div className="p-8">
          <Suspense fallback={<TopBarLoadingComp />}>{children}</Suspense>
        </div>
      </div>
    </div>
  );
};
