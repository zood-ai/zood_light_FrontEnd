import Tags from "./Tags";
import Selection from "./Selection";
import BranchDesc from "./BranchDesc";
import Device from "./Device";
import DeleteDevice from "./DeleteBranch";
import EmployeeBranch from "./EmployeeBranch";
import LeafletMap from "./Map";

const EditBranch = ({
  setIsEdit,
}: {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      {/* desc */}
      <BranchDesc />
      {/* tags */}
      <Tags />
      {/* selection */}
      <Selection />
      {/* device */}
      <Device />
      {/* Map */}
      <LeafletMap />
      {/* Delete */}
      <DeleteDevice setIsEdit={setIsEdit} />

      {/* {} */}

    </>
  );
};

export default EditBranch;
