import FolderIcon from "@/assets/icons/Folder";
import CustomModal from "@/components/ui/custom/CustomModal";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import LabourTargets from "./LabourTargets";
import OpeningHour from "./OpeningHour";
import HolidayandEvents from "./HolidayandEvents";
import HolidayEntitlement from "./HolidayEntitlement";
import Departments from "./Departments";
import Positions from "./Positions";
import ClockingMobile from "./ClockingMobile";

const EditBranch = () => {
  const { watch, setValue } = useFormContext();

  return (
    <>
      <LabourTargets />
      <OpeningHour />
      <HolidayandEvents />
      <HolidayEntitlement />
      <Positions />
      <Departments />
      <ClockingMobile />
    </>
  );
};

export default EditBranch;
