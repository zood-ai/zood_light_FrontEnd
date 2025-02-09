import { Outlet, useLocation, useNavigate } from "react-router-dom";

const PosSettings: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const subPath: string = pathname.split("/")[3] || "";

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const menuItems = [
    { name: "Branches", path: "branches" },
    { name: "Devices", path: "devices" },
    { name: "Taxes", path: "taxes" },
    { name: "Payment Methods", path: "payemnt-methods" },
    { name: "Reasons", path: "reasons" },

    { name: "General setting", path: "general-settings" },
    { name: "Receipt setting", path: "receipt-settings" },
  ];

  return (
    <div className="grid grid-cols-12">
      <div className="border border-input py-[24px] px-[10px] rounded-[4px]  col-span-2 flex flex-col h-[80vh]">
        {menuItems.map(({ name, path }) => (
          <p
            key={path}
            onClick={() => handleNavigation(path)}
            className={`py-5 px-3 border-b-2 cursor-pointer ${
              subPath === path
                ? "border-primary text-primary"
                : "border-transparent"
            }`}
          >
            {name}
          </p>
        ))}
      </div>
      <div className="col-span-10 mt-2 px-[24px]">
        <Outlet />
      </div>
    </div>
  );
};

export default PosSettings;
