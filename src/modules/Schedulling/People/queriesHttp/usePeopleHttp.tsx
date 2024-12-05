import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/guards/axiosInstance";
import axios from "axios";
interface IusePeopleHttp {
    handleCloseSheet?: () => void;
    employeeId?: string;
    setEmployeeOne?: any;
    setModalName?: any;
    handleAppend?: any;
}
const usePeopleHttp = ({ handleCloseSheet, employeeId, setEmployeeOne, setModalName, handleAppend }: IusePeopleHttp) => {
    const { toast } = useToast();
    const { filterObj } = useFilterQuery();

    const queryClient = useQueryClient();

    // get list
    const {
        data: PeopleData,
        isPending: isLoadingPeople,
        refetch: refetchPeople,
    } = useCustomQuery(
        ["people", filterObj],
        "/forecast-console/employee",
        {},
        { ...filterObj }
    );
    // get one
    const { data: employeeDataOne, isFetching: isFetchingemployeeOne, refetch: refetchEmployeeOne } =
        useCustomQuery(
            ["forecast-console/employee", employeeId || ""],
            `/forecast-console/employee/${employeeId}`,
            {
                select: (data: any) => {
                    const newDataFormat = {
                        id: data?.data?.id,
                        status: data?.data?.status,
                        title: data?.data?.title,
                        first_name: data?.data?.first_name,
                        last_name: data?.data?.last_name,
                        preferred_name: data?.data?.preferred_name,
                        email: data?.data?.email,
                        start_date: data?.data?.start_date,
                        birth_date: data?.data?.birth_date,
                        phone: data?.data?.phone,
                        contract: data?.data?.contract,
                        contract_hrs: data?.data?.contract_hrs,
                        tin: data?.data?.tin,
                        address: data?.data?.address,
                        branch_id: data?.data?.branch?.id,
                        forecast_position_id: data?.data?.position?.id,
                        forecast_department_id: data?.data?.department?.id,
                        visa_type: data?.data?.visa_type,
                        visa_date: data?.data?.visa_date,
                        gender: data?.data?.gender,
                        iban: data?.data?.iban,
                        swift: data?.data?.swift,
                        availability: data?.data?.availability,
                        positions: data?.data?.positions,
                        departments: data?.data?.departments?.map((department: {
                            id: string,
                            position_id: string
                        }) =>
                        ({
                            id: department.id,
                            forecast_position_id: department.position_id,

                        })),

                        branches: data?.data?.branches?.map((branch: {
                            id: string, name: string, pivot: {
                                is_home: number,
                            }
                        }) =>
                        ({
                            id: branch.id,
                            name: branch.name,
                            is_home: !!branch.pivot.is_home
                        })),
                        wage_type: data?.data?.wage_type,
                        wage: +data?.data?.wage,
                        payroll_id: data?.data?.payroll_id,
                        timecard_id: data?.data?.timecard_id,
                        pin: data?.data?.pin,
                        carryover: +data?.data?.carryover,
                        yearly_paid_entitlements: +data?.data?.yearly_paid_entitlements,
                        taken: +data?.data?.taken,
                        planned: +data?.data?.planned,
                        current_balance: +data?.data?.current_balance,
                        receives_holiday_entitlements: data?.data?.receives_holiday_entitlements,
                        documents: data?.data?.documents,


                    };
                    return newDataFormat;
                },

                enabled: !!employeeId,
                onSuccess: (data) => {
                    setEmployeeOne?.({
                        id: data?.data?.id,
                        status: data?.data?.status,
                        title: data?.data?.title,
                        first_name: data?.data?.first_name,
                        last_name: data?.data?.last_name,
                        preferred_name: data?.data?.preferred_name,
                        email: data?.data?.email,
                        start_date: data?.data?.start_date,
                        birth_date: data?.data?.birth_date,
                        phone: data?.data?.phone,
                        contract: data?.data?.contract,
                        contract_hrs: data?.data?.contract_hrs,
                        tin: data?.data?.tin,
                        address: data?.data?.address,
                        branch_id: data?.data?.branch?.id,
                        forecast_position_id: data?.data?.position?.id,
                        forecast_department_id: data?.data?.department?.id,
                        gender: data?.data?.gender,
                        iban: data?.data?.iban,
                        swift: data?.data?.swift,
                        visa_type: data?.data?.visa_type,
                        visa_date: data?.data?.visa_date,
                        availability: data?.data?.availability,
                        positions: data?.data?.positions,
                        departments: data?.data?.departments?.map((department: {
                            id: string,
                            position_id: string
                        }) =>
                        ({
                            id: department.id,
                            forecast_position_id: department.position_id,

                        })),
                        branches: data?.data?.branches?.map((branch: {
                            id: string, name: string, pivot: {
                                is_home: number,
                            }
                        }) =>
                        ({
                            id: branch.id,
                            name: branch.name,
                            is_home: !!branch.pivot.is_home
                        })),
                        wage_type: data?.data?.wage_type,
                        wage: +data?.data?.wage,
                        payroll_id: data?.data?.payroll_id,
                        timecard_id: data?.data?.timecard_id,
                        pin: data?.data?.pin,
                        carryover: data?.data?.carryover,
                        yearly_paid_entitlements: data?.data?.yearly_paid_entitlements,
                        taken: data?.data?.taken,
                        planned: data?.data?.planned,
                        current_balance: data?.data?.current_balance,
                        receives_holiday_entitlements: data?.data?.receives_holiday_entitlements,
                        documents: data?.data?.documents,



                    });
                },
            }
        );
    // add
    const { mutate: addEmployee, isPending: isLoadingAdd } = useMutation({
        mutationKey: ["employee-add"],
        mutationFn: async (values: any) => {
            return axiosInstance.post(`/forecast-console/employee`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Created employee Successfully",
            });
            refetchPeople();

            handleCloseSheet?.();


        },
        onError: (error: any) => {
            console.log(error);


            toast({
                description: error.data.message,
            });

        },
    });
    // edit
    const { mutate: editEmployee, isPending: isLoadingEdit } = useMutation({
        mutationKey: ["employee-edit"],
        mutationFn: async (values: any) => {
            return axiosInstance.post(`/forecast-console/employee/${values?.id}`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Updated Employee Successfully",
            });
            refetchPeople();
            handleCloseSheet?.();


        },
        onError: (error: any) => {
            console.log(error);


            toast({
                description: error.data.message,
            });

        },
    });

    //get feedback

    const { data: feedbackData, isPending: isLoadingFeedback, refetch: refetchFeedback } =
        useCustomQuery(
            ["feedback", employeeId || ""],
            `/forecast-console/employee-feedbacks?filter[employee_id]=${employeeId}`,
            {
                select: (data: any) => {
                    return { notes: data?.data };
                },
                enabled: !!employeeId,
                onSuccess: (data: any) => {

                    setEmployeeOne?.((prev: any) => ({ ...prev, notes: data?.data }))


                },
            }
        );
    // create feedabck
    const { mutate: addFeedback, isPending: isLoadingAddFeedback } = useMutation({
        mutationKey: ["feedback-add"],
        mutationFn: async (values: any) => {
            return axiosInstance.post(`/forecast-console/employee-feedbacks`, values);
        },
        onSuccess: (data) => {
            toast({
                description: "Add Feedback Successfully",
            });
            handleAppend?.(data);

        },
        onError: (error: any) => {
            console.log(error);
            refetchEmployeeOne()
            toast({
                description: error.data.message,
            });

        },
    });

    // delete feedback
    const { mutate: deleteFeedback, isPending: isLoadingDeleteFeedback } = useMutation({
        mutationKey: ["feedback-delete"],
        mutationFn: async (values: any) => {
            return axiosInstance.delete(`/forecast-console/employee-feedbacks/${values?.id}`);
        },
        onSuccess: (data) => {
            toast({
                description: "Delete Feedback Successfully",
            });
            setModalName("")
        },


        onError: (error: any) => {
            console.log(error);


            toast({
                description: error.data.message,
            });

        },
    });

    // delete employee
    const { mutate: deleteEmployee, isPending: isLoadingDeleteEmployee } = useMutation({
        mutationKey: ["employee-delete"],
        mutationFn: async (values: { id: String ,reason_removed: string}) => {
            return axiosInstance.delete(`forecast-console/employee/${values?.id}?reason_removed=${values?.reason_removed}`);
        },
        onSuccess: (data) => {
            toast({
                description: "Delete Employee Successfully",
            });
            refetchPeople();
            handleCloseSheet?.();


        },
        onError: (error: any) => {
            console.log(error);


            toast({
                description: error.data.message,
            });

        },
    });

    // update documents
    const { mutate: updateDocuments, isPending: isLoadingUpdateDocuments } = useMutation({
        mutationKey: ["documents-update"],
        mutationFn: async (values: any) => {
            return axiosInstance.post(`forecast-console/update-employee-document/${values?.id}`, values);
        },
        onSuccess: ({data}) => {
            toast({
                description: "Update Documents Successfully",
            });
            // refetchEmployeeOne();
            queryClient.setQueryData(
                ["forecast-console/employee", filterObj.id ?? ""],
                
                (oldData: any) => {
                  if (!oldData) return;
                    const newData = oldData.data.documents.map((item: any) => {
                      if (item.id == data.data.document_id) {
                        return {
                          ...item,
                          status: data.data.status,
                        }
                      }
                      else {
                        return item
                      }
                    })

             
                    setEmployeeOne?.({
                        ...oldData.data,
                        documents: newData
                      })
                  return {
                    data: {
                      ...oldData.data,
                      documents: newData
                    }
                  };
                }
              );
            
            handleCloseSheet?.();


        },
        onError: (error: any) => {
            console.log(error);


            toast({
                description: error.data.message,
            });

        },
    });

     // get attendace
     const { data: employeeAttendace, isFetching: isFetchingemployeeAttendace, refetch: refetchEmployeeAttendace } =
     useCustomQuery(
         ["forecast-console/employee-attend", employeeId || ""],
         `/forecast-console/employee-attend/${employeeId}`,
         {
             select: (data: any) => {
                
                 return data;
             },

             enabled: !!employeeId,
             
         }
     );
    return {
        PeopleData,
        isLoadingPeople,
        addEmployee,
        isLoadingAdd,
        employeeDataOne,
        isFetchingemployeeOne,
        editEmployee,
        isLoadingEdit,
        feedbackData,
        isLoadingFeedback,
        isLoadingAddFeedback,
        addFeedback,
        deleteFeedback,
        isLoadingDeleteFeedback,
        deleteEmployee,
        isLoadingDeleteEmployee,
        updateDocuments,
        isLoadingUpdateDocuments,
        employeeAttendace,
        isFetchingemployeeAttendace,


    };
};

export default usePeopleHttp;
