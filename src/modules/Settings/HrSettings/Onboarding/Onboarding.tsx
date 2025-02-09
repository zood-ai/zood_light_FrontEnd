import React from "react";
import Card from "./components/Card";
import { set } from "date-fns";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { formOnboardingProviderSchema, formOnboardingSchema } from "./Schema/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useOnboardingHttps from "./queriesHttps/useOnboardingHttp";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomFileImage from "@/components/ui/custom/CustomFileImage";
import CustomModal from "@/components/ui/custom/CustomModal";
const Onboarding = () => {
  const [isOpen, setIsOpen] = React.useState(0);
  const [isEdit, setIsEdit] = React.useState(0);
  const [id, setId] = React.useState("");
  const [modalName, setModalName] = React.useState("");


  const defaultValues = {
    id: "",
    name: "",
    new_employees_required: 0,
    description: "",
    file: ""

  };

  const getSchema = () => {
    if (isOpen === 1 || isEdit === 1) {

      return formOnboardingProviderSchema;
    }
    return formOnboardingSchema;
  };

  const form = useForm<z.infer<typeof formOnboardingSchema | typeof formOnboardingProviderSchema>>({
    resolver: zodResolver(getSchema()),
    defaultValues,
  });
  const handleCloseSheet = () => {
    setIsOpen(0);
    setIsEdit(0)
    form.reset(defaultValues);
    setId("")
    setModalName("")

  };

  const onSubmit = (values: any) => {

    const formData = new FormData();
    formData.append("file", values.file);
    formData.append(
      "name",
      values.name
    );
    formData.append("description", values.description);
    formData.append("new_employees_required", values.new_employees_required);
    formData.append("id", values.id);
    if (isEdit) {
      // 1= provide //2= review //3= sign
      formData.append("_method", "PUT");
      formData.append("type", isEdit.toString());
      OnboardingEdit(formData)
    } else {
      formData.append("type", isOpen.toString());
      OnboardingAdd(formData)

    }
  };
  const { OnboardingAdd, isLoadingAdd, OnboardingEdit, isLoadingEdit, isLoadingDocumentSingle, OnboardingDelete, isLoadingDelete, DocumentSingle } = useOnboardingHttps({
    handleCloseSheet,
    id: id,
    setDocumentsOne: (data: any) => {
      form.reset(data);
    }
  })

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      OnboardingDelete(id || "");
    }
  };

  console.log(form.getValues());


  return (
    <>
      {/* provider */}
      <div className="ml-[241px] w-[645px]">
        <h2 className="font-bold text-[20px]">Employee onboarding settings</h2>
        <Card
          title="Documents that need to be provided"
          description="Add documents that employees will need to provide during onboarding"
          type={1}
          onClick={() => {
            setIsOpen(1)
          }
          }
          onEdit={(id) => {
            setIsEdit(1)
            setId(id)

          }
          }
        />
        {/* review */}

        <Card
          title="Documents that need to be reviewed"
          description="Upload documents that employees will need to review during onboarding"
          type={2}
          onClick={() => {
            setIsOpen(2)
          }
          }
          onEdit={(id) => {
            setIsEdit(2)
            setId(id)


          }
          }
        />{" "}
        {/* sign */}
        <Card
          title="Documents that need to be signed"
          description="Create document templates that needed to be signed during onboarding"
          type={3}
          onClick={() => {
            setIsOpen(3)
          }
          }
          onEdit={(id) => {
            setIsEdit(3)
            setId(id)

          }
          }
        />{" "}
      </div>

      <CustomSheet
        isOpen={[1, 2, 3].includes(isOpen) || [1, 2, 3].includes(isEdit)}
        isEdit={[1, 2, 3].includes(isEdit)}
        isDirty={form.formState.isDirty}
        btnText={"Create"}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={isOpen == 1 || isEdit == 1 ? "Document that needs to be provided" :
          isOpen == 2 || isEdit == 2 ? "Document that needs to be reviewed" :
            isOpen == 3 || isEdit == 3 ? "Document that needs to be signed" : "New Position"}



        form={form}
        isLoadingForm={isLoadingDocumentSingle}
        isLoading={isLoadingAdd || isLoadingEdit || isLoadingDelete}
        onSubmit={onSubmit}
        setModalName={setModalName}
      >
        <>
          <Input type="text" label="Name" value={form.watch("name")} className="w-[400px]" placeholder="Enter name" onChange={(e) => {
            form.setValue("name", e.target.value, { shouldValidate: true, shouldDirty: true });
          }} />

          <Textarea
            placeholder="Enter description"
            label="Description"
            {...form.register("description")}
            className="w-[400px]"
          />

          {([1, 2].includes(isOpen) || [1, 2].includes(isEdit)) && (<div className="flex  gap-2 items-center mt-6">
            <Checkbox
              checked={Boolean(form.watch("new_employees_required"))}
              onCheckedChange={(e) => {
                form.setValue("new_employees_required", +e);
              }}
            />
            <Label htmlFor="">All new starters need to provide this document</Label>
          </div>)}

          {([2, 3].includes(isOpen) || [2, 3].includes(isEdit)) && (<div className="flex  gap-2 items-center mt-6">
            <CustomFileImage
              fileParam={"file"}
              title="Drop your file here, or"
              description=""
              defaultValue={form.watch("file")?.toString()}
              fileCheck={true}
              handleRest={() => {
                form.setValue("file", undefined, { shouldValidate: true, shouldDirty: true });
              }}
              className="w-[400px]"
              extenstion="*"

            />
          </div>)}



        </>


      </CustomSheet>
      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={"Document"}
      />
    </>
  );
};

export default Onboarding;
