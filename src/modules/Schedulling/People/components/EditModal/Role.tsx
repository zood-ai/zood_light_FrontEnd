import React from "react";
import Position from "./Role/Position";
import Location from "./Role/Location";
import Holiday from "./Role/Holiday ";

const Role = ({employeeData}:{employeeData:{id:string}[]}) => {
  return (
    <>
      <Location employeeData={employeeData}/>
      <Position />
      <Holiday />
    </>
  );
};

export default Role;
