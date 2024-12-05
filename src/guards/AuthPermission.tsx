type ProtectedRouteType = {
    permissionRequired?: string;
    children: React.ReactNode;
};
const AuthPermission = ({ children, permissionRequired }: ProtectedRouteType) => {
    const _auth = JSON.parse(localStorage.getItem("___permission") || "[]");


    return (
        <>
            {_auth.includes(permissionRequired) ? children : <></>}
        </>



    )
}

export default AuthPermission