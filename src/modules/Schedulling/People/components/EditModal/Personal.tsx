import Details from "./Personal/Details";
import Legal from "./Personal/Legal";
import Payroll from "./Personal/Payroll";
import Remove from "./Personal/Remove";

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
      <Remove handleCloseSheet={handleCloseSheet} />
    </>
  );
};

export default Personal;
