import DotLogo from "@/assets/icons/DotLogo";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { FormProvider, UseFormReturn, FieldValues, useFormContext } from "react-hook-form";

type AuthCompProps<T extends FieldValues> = {
    title: string;
    desc: string | ReactNode;
    body: React.ReactNode;
    loading: boolean;
    form: UseFormReturn<T>;
    fn: (values: T) => void;
    btnTxt: string;
};

const AuthComp = <T extends FieldValues>({
    title,
    desc,
    body,
    loading,
    form,
    fn,
    btnTxt,
}: AuthCompProps<T>) => {
    const onSubmit = (values: T) => {
        console.log(values);

        fn(values);
    };

    return (
        <div className="lg:grid grid-cols-5 text-textPrimary ">
            <DotLogo className="absolute top-0 left-0 m-3" height="64px" width="64px" />

            <div className="bg-popover hidden lg:flex  flex-col justify-center items-center col-span-3 h-[100vh]">
                <DotLogo className="absolute top-0 left-0 m-3" height="64px" width="64px" />
                <div className="align-end ">

                    <p className="text-[32px] font-bold">Welcome {title} 👋</p>
                    <p className="mt-[12px] text-[16px] ">{desc}</p>
                </div>
            </div>

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex flex-col justify-center col-span-3 h-[100vh] px-[48px]">
                        {body}
                        <div className="w-[348px]">
                            <Button
                                className="w-[60px] mt-[32px] px-[40px]"
                                type="submit"
                                loading={loading}
                                disabled={!form.formState.isValid}
                            >
                                {btnTxt}
                            </Button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default AuthComp;