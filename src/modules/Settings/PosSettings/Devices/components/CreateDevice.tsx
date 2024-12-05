import DeviceDesc from "./DeviceDesc";
import Tags from "./Tags";

const CreateDevice = ({ isEdit }: { isEdit: boolean }) => {
  return (
    <>
      {/* desc */}
      <DeviceDesc isEdit={isEdit} />
      {isEdit && <Tags />}
    </>
  );
};

export default CreateDevice;
