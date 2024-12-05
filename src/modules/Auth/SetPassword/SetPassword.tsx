import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthComp from "@/components/ui/custom/Auth";
import { formSetPasswordSchema } from "./Schema/schema";
import MemoChecked from "@/assets/icons/Checked";
import useFilterQuery from "@/hooks/useFilterQuery";
import useSetPasswordHttp from "./queriesHttp/useSetPasswordHttp";

const SetPassword = () => {
    const { filterObj } = useFilterQuery()
    const form = useForm<z.infer<typeof formSetPasswordSchema>>({
        resolver: zodResolver(formSetPasswordSchema),
        defaultValues: {
            invitation_token: filterObj['invitation_token'],
            email: filterObj['email'],
            business_reference: filterObj['business_reference'],
            password: "",
        },
    });

    const {
        register,
        trigger,
        watch,
    } = form;

    const passwordValue = watch("password"); // Watch the password value

    const { setPassword, loadingSetPassword } = useSetPasswordHttp();


    return (
        <AuthComp
            fn={setPassword}
            form={form}
            loading={loadingSetPassword}
            btnTxt="Sign up"
            title={filterObj['name']}
            desc={
                <>
                    Create a password to get started
                    <p className="font-bold my-5">Make sure the password contains:</p>
                    <ul className="marker:text-red-500 list-outside list-disc ml-5 space-y-2">
                        <li >
                            At least one capital letter
                            <div className="inline-flex px-1" >

                                {/[A-Z]/.test(passwordValue) ? (
                                    <MemoChecked color="green" />
                                ) : (
                                    <></>
                                )}
                            </div>
                        </li>
                        <li >
                            One or more numbers
                            <div className="inline-flex px-1" >



                                {/\d/.test(passwordValue) ? (
                                    <MemoChecked color="green" />
                                ) : (
                                    <></>
                                )}
                            </div>

                        </li>
                        <li >
                            A special character
                            <div className="inline-flex px-1" >


                                {/[!@#$%^&*]/.test(passwordValue) ? (
                                    <MemoChecked color="green" />
                                ) : (
                                    <></>
                                )}
                            </div>
                        </li>
                        <li >
                            The password must be 6 characters long.
                            <div className="inline-flex px-1" >


                                {passwordValue.length >= 6 ? (
                                    <MemoChecked color="green" />
                                ) : (
                                    <></>
                                )}
                            </div>
                        </li>

                    </ul >
                </>
            }
            body={
                <>
                    <p className=" block lg:hidden text-[32px] font-bold mb-5">Welcome {filterObj['name']}👋</p>

                    <Input
                        label="Business reference"
                        placeholder="Business reference"
                        className="w-[348px]"
                        disabled={true}

                        {...register("business_reference")}
                    />
                    <Input
                        label="Email address"
                        placeholder="Email address"
                        className="w-[348px]"
                        disabled={true}
                        {...register("email")}
                    />
                    <Input
                        label="Set Password"
                        placeholder="Password"
                        type="password"
                        className="w-[348px] "
                        {...register("password", {
                            onChange: () => {
                                trigger("password");
                            },
                        })}
                    />


                    <ul className="lg:hidden block  marker:text-red-500 list-outside list-disc w-full m-5">
                        <li >
                            At least one capital letter
                            <div className="inline-flex px-1" >

                                {/[A-Z]/.test(passwordValue) ? (
                                    <MemoChecked color="green" />
                                ) : (
                                    <></>
                                )}
                            </div>
                        </li>
                        <li >
                            One or more numbers
                            <div className="inline-flex px-1" >



                                {/\d/.test(passwordValue) ? (
                                    <MemoChecked color="green" />
                                ) : (
                                    <></>
                                )}
                            </div>

                        </li>
                        <li >
                            A special character
                            <div className="inline-flex px-1" >


                                {/[!@#$%^&*]/.test(passwordValue) ? (
                                    <MemoChecked color="green" />
                                ) : (
                                    <></>
                                )}
                            </div>
                        </li>
                        <li >
                            The password must be 6 characters long.
                            <div className="inline-flex px-1" >


                                {passwordValue.length >= 6 ? (
                                    <MemoChecked color="green" />
                                ) : (
                                    <></>
                                )}
                            </div>
                        </li>

                    </ul >


                </>
            }
        />
    );
};

export default SetPassword;
