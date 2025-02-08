import useFilterQuery from "@/hooks/useFilterQuery";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formAddPopularShiftSchema } from "../Schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useCommonRequests from "@/hooks/useCommonRequests";
import { useEffect } from "react";

const usePopularForm = () => {
  const { filterObj } = useFilterQuery();

  const { shiftTypesSelect } = useCommonRequests({
    getShiftTypes: true,
  });
  useEffect(() => {
    if (shiftTypesSelect) {
      form.setValue(
        "shift_type_id",
        shiftTypesSelect?.find((shift) => shift?.type === "regular")?.value,
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    }
  }, [shiftTypesSelect?.length]);

  const defaultValues = {
    time_from: "",
    time_to: "",
    branch_id: filterObj["filter[branch]"],
    shift_type_id: "",
  };
  const form = useForm<z.infer<typeof formAddPopularShiftSchema>>({
    resolver: zodResolver(formAddPopularShiftSchema),
    defaultValues,
  });

  return form;
};

export default usePopularForm;
