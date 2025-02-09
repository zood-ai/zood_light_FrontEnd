import AuthPermission from "@/guards/AuthPermission";
import Details from "./Personal/Details";
import Legal from "./Personal/Legal";
import Payroll from "./Personal/Payroll";
import Remove from "./Personal/Remove";
import { PERMISSIONS } from "@/constants/constants";

const Personal = ({handleCloseSheet}: any) => {
  return (
    <>
      {/* Employee Details */}
      <Details />
      {/* Legal */}
      <Legal />
      {/* Pyaroll */}
      <Payroll />
      {/* Remove */}
      <AuthPermission permissionRequired={[PERMISSIONS.can_deactivate_users_from_other_locations]}>
        <Remove handleCloseSheet={handleCloseSheet} />
      </AuthPermission> 
    </>
  );
};

export default Personal;
