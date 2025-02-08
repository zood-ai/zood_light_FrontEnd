import { FormProvider, UseFormReturn } from "react-hook-form";
import PopularShiftInput from "./PopularShiftInput";
import MemoChecked from "@/assets/icons/Checked";

import { useRef } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { formAddPopularShiftSchema } from "../Schema/schema";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

const SinglePopularInputs = ({
  focusedInput,
  handleClose,
  shiftAction,
  setFocusedInput,
  form,
  popularShiftAction,
  popularShiftActionLoading,
  isEdit,
}: {
  focusedInput: string;
  handleClose: () => void;
  shiftAction: boolean;
  setFocusedInput: (data: string) => void;
  form: UseFormReturn<z.infer<typeof formAddPopularShiftSchema>>;
  popularShiftAction: any;
  popularShiftActionLoading: boolean;
  isEdit?: boolean;
}) => {
  const InputsRef = useRef(null);

  const { toast } = useToast();

  useClickOutside({
    enabled: focusedInput !== "" && shiftAction,
    ref: InputsRef,
    cb: handleClose,
  });

  const onSubmit = (data) => {
    if (isEdit) {
      popularShiftAction({ id: data.id, data });
    } else {
      popularShiftAction(data);
    }
  };
  return (
    <FormProvider {...form}>
      <form
        ref={InputsRef}
        className="flex items-center justify-center gap-1 mb-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <PopularShiftInput
          className="w-[50px] px-1 text-center h-[30px] "
          name="time_from"
          formkey="time_from"
          setFocusedInput={setFocusedInput}
          focusedInput={focusedInput}
        />
        -
        <PopularShiftInput
          className="w-[50px] px-1 text-center h-[30px]"
          name="time_to"
          formkey="time_to"
          setFocusedInput={setFocusedInput}
          focusedInput={focusedInput}
        />
        <button
          disabled={popularShiftActionLoading}
          className={`border border-[#D1D5D7] w-[30px] h-[30px] flex items-center justify-center rounded-md cursor-pointer disabled:opacity-50`}
          type="submit"
        >
          <MemoChecked color="var(--secondary)" />
        </button>
      </form>
    </FormProvider>
  );
};

export default SinglePopularInputs;
