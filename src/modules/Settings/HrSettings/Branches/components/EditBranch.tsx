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
import AuthPermission from "@/guards/AuthPermission";
import { PERMISSIONS } from "@/constants/constants";

const EditBranch = () => {

  return (
    <>
      <AuthPermission permissionRequired={[PERMISSIONS.can_adjust_cost_of_labour_view]}>
        <LabourTargets />
      </AuthPermission>
      <OpeningHour />
      <HolidayandEvents />
      <HolidayEntitlement />
      <Departments />
      <Positions />
      <ClockingMobile />
    </>
  );
};

export default EditBranch;
