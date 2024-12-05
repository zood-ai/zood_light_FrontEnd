import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { formLoginSchema } from "./schema/Schema";
import useLoginHttp from "./queriesHttp/useLoginHttp";
import AuthComp from "@/components/ui/custom/Auth";

const Login = () => {
  const form = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      business_reference: "",
      password: "",
    },
  });
  const { login, loadingLogin } = useLoginHttp();

  return (


    <AuthComp
      fn={login}
      form={form}
      loading={loadingLogin}
      btnTxt="Login"
      title="Back"
      desc="To login enter you username and password."

      body={
        <>
          <Input
            label="Business reference"
            placeholder="Business reference"
            className="w-[348px]"
            {...form.register("business_reference")}
          />
          <Input
            label="Email address"
            placeholder="Email address"
            className="w-[348px]"
            {...form.register("email")}
          />
          <Input
            label="Password"
            placeholder="Password"
            type="password"
            className="w-[348px]"
            {...form.register("password")}
          />

        </>} />



  );
};
export default Login;
