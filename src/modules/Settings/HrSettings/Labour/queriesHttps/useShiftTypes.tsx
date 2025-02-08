import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { formOverTimeRulesSchema, formShiftTypeSchema } from "../Schema/schema";

interface IUseShiftTypesHttps {
    handleCloseSheet?: () => void;
    shiftId?: string;
    setShiftTypeOne?: (data: any) => void;
    overTimeRuleId?: string;
    setOverTimeRuleOne?: (data: any) => void;
    setClockingRulesOne?: (data: any) => void;
    clockingRules?: boolean;
}
const useShiftTypesHttps = ({ handleCloseSheet, shiftId, setShiftTypeOne, overTimeRuleId, setOverTimeRuleOne, setClockingRulesOne, clockingRules }: IUseShiftTypesHttps) => {
    const { toast } = useToast();
    const { filterObj } = useFilterQuery();

    const queryClient = useQueryClient();

    //------------------------------------------ Shift types -------------------------------------------
    // get list
    const {
        data: ShiftTypesData,
        isPending: isLoadingShiftTypes,
        refetch: refetchShiftTypes,
    } = useCustomQuery(
        ["shift-types"],
        "forecast-console/shift-types",
        {},
        { ...filterObj }
    );

    // get one

    const { data: ShiftTypeOne, isFetching: isLoadingShiftTypeOne } = useCustomQuery(
        ["shift-type-one", shiftId || ""],
        `/forecast-console/shift-types/${shiftId}`,
        {
            select: (data: any) => {
                const newData =
                {
                    id: data?.shift_type?.id,
                    name: data?.shift_type?.name,
                    include_employee_working_hours: !!data?.shift_type?.include_employee_working_hours,
                    employee_need_to_punch: !!data?.shift_type?.employee_need_to_punch,
                    deleted_when_schedule_cleared: !!data?.shift_type?.deleted_when_schedule_cleared,
                    icon: data?.shift_type?.icon,
                    is_paid: !!data?.shift_type?.is_paid,
                    pay_rate_amount: data?.shift_type?.pay_rate_amount,
                    pay_rate_type: data?.shift_type?.pay_rate_type,

                }
                return newData;
            },
            enabled: !!shiftId,
            onSuccess: (data) => {
                setShiftTypeOne?.({
                    name: data?.shift_type?.name,
                    id: data?.shift_type?.id,
                    include_employee_working_hours: !!data?.shift_type?.include_employee_working_hours,
                    employee_need_to_punch: !!data?.shift_type?.employee_need_to_punch,
                    deleted_when_schedule_cleared: !!data?.shift_type?.deleted_when_schedule_cleared,
                    icon: data?.shift_type?.icon,
                    is_paid: !!data?.shift_type?.is_paid,
                    pay_rate_amount: data?.shift_type?.pay_rate_amount,
                    pay_rate_type: data?.shift_type?.pay_rate_type,

                });
            },
        }
    );
    // add
    const { mutate: shiftTypeAdd, isPending: isLoadingAdd } = useMutation({
        mutationKey: ["shift-types-add"],
        mutationFn: async (values: z.infer<typeof formShiftTypeSchema>) => {
            return axiosInstance.post(`forecast-console/shift-types`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Created shift type successfully",
            });
            refetchShiftTypes();
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["shiftTypee-one"] });
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                toast({
                    description: error.response?.data.message,
                });
            } else {
                toast({
                    description: error.message,
                });
            }
        },
    });
    // edit
    const { mutate: shiftTypeEdit, isPending: isLoadingEdit } = useMutation({
        mutationKey: ["shift-type-edit"],
        mutationFn: async (values: any) => {
            return axiosInstance.put(`forecast-console/shift-types/${values?.shiftType_id}`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Updated shift type successfully",
            });
            refetchShiftTypes();
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["shiftTypee-one"] });
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                toast({
                    description: error.response?.data.message,
                });
            } else {
                toast({
                    description: error.message,
                });
            }
        },
    });

    // delete
    const { mutate: shiftTypeDelete, isPending: isLoadingDelete } = useMutation({
        mutationKey: ["shift-types-delete"],
        mutationFn: async (values: string) => {
            return axiosInstance.delete(`forecast-console/shift-types/${values}`);
        },
        onSuccess: (data) => {
            toast({
                description: "Updated shiftType Successfully",
            });
            refetchShiftTypes();
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["shiftTypee-one"] });
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                toast({
                    description: error.response?.data.message,
                });
            } else {
                toast({
                    description: error.message,
                });
            }
        },
    });

    //------------------------------------------ Over time rules -------------------------------------------
    // get list
    const {
        data: OverTimeRulesData,
        isPending: isLoadingOverTimeRules,
        refetch: refetchOverTimeRules,
    } = useCustomQuery(
        ["over-time-rules"],
        "forecast-console/overtime-rules",
        {},
        { ...filterObj }
    );
    const { data: OverTimeRulesOne, isFetching: isLoadingOverTimeRulesOne } = useCustomQuery(
        ["over-time-rules-one", overTimeRuleId || ""],
        `/forecast-console/overtime-rules/${overTimeRuleId}`,
        {
            select: (data: any) => {
                const newData =
                {
                    id: data?.rule?.id,
                    name: data?.rule?.name,
                    scenario: data?.rule?.scenario.toString(),
                    day: data?.rule?.day,
                    applies_to_hourly: !!data?.rule?.applies_to_hourly,
                    applies_to_daily: !!data?.rule?.applies_to_daily,
                    applies_to_salaried: !!data?.rule?.applies_to_salaried,
                    hours_per_week: data?.rule?.hours_per_week,
                    paid_rate: data?.rule?.paid_rate,



                }
                return newData;
            },
            enabled: !!overTimeRuleId,
            onSuccess: (data) => {
                setOverTimeRuleOne?.({
                    name: data?.rule?.name,
                    id: data?.rule?.id,
                    scenario: data?.rule?.scenario.toString(),
                    day: data?.rule?.day,
                    applies_to_hourly: !!data?.rule?.applies_to_hourly,
                    applies_to_daily: !!data?.rule?.applies_to_daily,
                    applies_to_salaried: !!data?.rule?.applies_to_salaried,
                    hours_per_week: +data?.rule?.hours_per_week,
                    paid_rate: data?.rule?.paid_rate,



                });
            },
        }
    );

    // add
    const { mutate: overTimeRuleAdd, isPending: isLoadingOverTimeAdd } = useMutation({
        mutationKey: ["over-time-rules-add"],
        mutationFn: async (values: z.infer<typeof formOverTimeRulesSchema>) => {
            return axiosInstance.post(`forecast-console/overtime-rules`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Created overtime rule successfully",
            });
            refetchOverTimeRules();
            handleCloseSheet?.();

            queryClient.invalidateQueries({ queryKey: ["overTimeRulee-one"] });
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                toast({
                    description: error.response?.data.message,
                });
            } else {
                toast({
                    description: error.message,
                });
            }
        },
    });

    //edit
    const { mutate: overTimeRuleEdit, isPending: isLoadingOverTimeEdit } = useMutation({
        mutationKey: ["over-time-rule-edit"],
        mutationFn: async (values: any) => {
            return axiosInstance.put(`forecast-console/overtime-rules/${values?.id}`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Updated overtime rule successfully",
            });
            refetchOverTimeRules(); //refetch data
            handleCloseSheet?.();
            queryClient.invalidateQueries({ queryKey: ["overTimeRulee-one"] });
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                toast({
                    description: error.response?.data.message,
                });
            } else {
                toast({
                    description: error.message,
                });
            }
        },
    });
    //  delete
    const { mutate: overTimeRuleDelete, isPending: isLoadingOverTimeDelete } = useMutation({
        mutationKey: ["over-time-rules-delete"],
        mutationFn: async (values: string) => {
            return axiosInstance.delete(`forecast-console/overtime-rules/${values}`);
        },
        onSuccess: (data) => {
            toast({
                description: "Updated overTimeRule Successfully",
            });
            refetchOverTimeRules();
            handleCloseSheet?.();
            queryClient.invalidateQueries({ queryKey: ["overTimeRulee-one"] });
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                toast({
                    description: error.response?.data.message,
                });
            } else {
                toast({
                    description: error.message,
                });
            }
        },
    });
    // -------------------------------------------------Clocking rules---------------------------------------------



    const { data: ClockingRulesData
        , isPending: isLoadingClockingRules } = useCustomQuery(
            ["Clocking-rules"],
            `/forecast-console/clockin-rules`,
            {
                select: (data: any) => {

                    const newData =
                    {
                        id: data?.data?.id,
                        break_option: data?.data?.break_option.toString(),
                        rounding_rules: data?.data?.rounding_rules,
                        break_rules: data?.data?.break_rules,




                    }
                    return newData;
                },
                enabled: !!clockingRules,
                onSuccess: (data) => {
                    setClockingRulesOne?.({
                        id: data?.data?.id,
                        break_option: data?.data?.break_option.toString(),
                        rounding_rules: data?.data?.rounding_rules,
                        break_rules: data?.data?.break_rules,




                    });
                },
            }
        );

    // edit
    const { mutate: clockingRulesEdit, isPending: isLoadingclockingRulesEdit } = useMutation({
        mutationKey: ["clocking-rules-edit"],
        mutationFn: async (values: any) => {
            return axiosInstance.post(`forecast-console/clockin-rules`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Updated clocking rules Successfully",
            });
            refetchOverTimeRules();
            handleCloseSheet?.();
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                toast({
                    description: error.response?.data.message,
                });
            } else {
                toast({
                    description: error.message,
                });
            }
        },
    });

    return {
        isLoadingShiftTypes,
        ShiftTypesData,
        shiftTypeEdit,
        isLoadingEdit,
        shiftTypeAdd,
        isLoadingAdd,
        shiftTypeDelete,
        isLoadingDelete,
        ShiftTypeOne,
        isLoadingShiftTypeOne,
        OverTimeRulesData,
        isLoadingOverTimeRules,
        isLoadingOverTimeAdd,
        OverTimeRulesOne,
        isLoadingOverTimeRulesOne,
        overTimeRuleAdd,
        overTimeRuleEdit,
        isLoadingOverTimeEdit,
        overTimeRuleDelete,
        isLoadingOverTimeDelete,
        ClockingRulesData,
        isLoadingClockingRules,
        clockingRulesEdit,
        isLoadingclockingRulesEdit


    };
};

export default useShiftTypesHttps;
