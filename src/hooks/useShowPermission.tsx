
const useShowPermission = () => {
    const _permissions = JSON.parse(localStorage.getItem("___permission") || "[]");
    
    const handlePremission=(permission:string)=>
      {
       return !_permissions.includes(permission)
        
    }
   

  return {handlePremission};
}

export default useShowPermission