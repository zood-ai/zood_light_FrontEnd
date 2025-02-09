import LocationForm from "@/components/LocationForm";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const LocationGroupForm = () => {
  const { register } = useFormContext();
  return (
    <>
      <div>
        <Input
          label="Group name"
          className="mb-10"
          type="text"
          placeholder="Type a group name"
          {...register("name")}
        />

        <LocationForm
          text="Select locations that belong to this group

"
        />
      </div>
    </>
  );
};

export default LocationGroupForm;
