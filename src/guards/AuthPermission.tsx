type ProtectedRouteType = {
    permissionRequired?: string[];
    children: React.ReactNode;

};
function matchArray(arr1, arr2) {
    return arr1?.some(element => arr2.includes(element));
}

const AuthPermission = ({ children, permissionRequired }: ProtectedRouteType) => {
    const _admin = JSON.parse(localStorage.getItem("___admin") || "0");
    const _auth = JSON.parse(localStorage.getItem("___permission") || "[]");
    return (
        <>
            {
                _admin ?
                    <>
                        {children}
                    </>
                    : <>
                        {matchArray(permissionRequired, _auth) ? children : <></>}
                    </>

            }

        </>

    )
}

export default AuthPermission