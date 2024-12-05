import CustomSection from "@/components/ui/custom/CustomSection";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LocationForm from "@/components/LocationForm";
import { formStationsSchema } from "./Schema/schema";
const Stations = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalName, setModalName] = useState("");

  const data = [{ name: "test", num: "1" }];
  const handleCloseSheet = () => {
    setIsOpen(false);
  };
  const defaultValues = {
    name: "",
  };
  const form = useForm<z.infer<typeof formStationsSchema>>({
    resolver: zodResolver(formStationsSchema),
    defaultValues,
  });
  const onSubmit = () => {};
  return (
    <div className="ml-[241px] w-[645px]">
      <CustomSection
        title="Stations"
        description="Add new station"
        setIsOpen={setIsOpen}
        Data={[]}
        isLoading={false}
        body={
          <>
            {data?.map((tax: { name: string; num: string }) => (
              <div
                className="flex justify-between items-center border-b border-input px-2 py-5"
                onClick={() => {}}
              >
                <div>{tax?.name}</div>
                <div className="font-bold">{tax?.num} </div>
              </div>
            ))}
          </>
        }
      />

      <CustomSheet
        isOpen={isOpen}
        isEdit={false}
        btnText={"Create"}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={isOpen ? "New Station" : "Edit Station"}
        form={form}
        // isLoadingForm={isLoadingTaxOne}
        // isLoading={isLoadingCreate || isLoadingEdit || isLoadingDelete}
        onSubmit={onSubmit}
        setModalName={setModalName}
      >
        <Input
          label="Department name"
          name="name"
          type="text"
          placeholder="Enter name"
        />
      </CustomSheet>
    </div>
  );
};

export default Stations;
