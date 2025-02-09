import { ReactNode } from 'react';

export interface LoginForm {
    business_reference: string;
    email: string;
    password: any;
}

export interface SignUpForm {
    business_name: string;
    email: string;
    password: any;
    user_name: string;
    business_type: string;
    business_Location: string;
}
export interface FormGroupProps {
    label?: any;
    name: string;
    formik: any;
    type?: string;
    placeholder?: string;
    loginSteps?: number;
    setLoginSteps?: React.Dispatch<React.SetStateAction<number>>;
    t?: any;
}
