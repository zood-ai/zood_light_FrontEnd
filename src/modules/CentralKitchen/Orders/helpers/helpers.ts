export const handleStatus = (status: string) => {
  switch (status) {
    case "2":
      return "Requested";
    case "21":
      return "Rejected";
    case "22":
      return "Sent";
    case "3":
      return "Canceled";

    case "4":
      return "Sent";

    default:
      break;
  }
};

export const handleStatusShap = (status: string) => {
  switch (status) {
    case "2":
      return "info";
    case "21":
      return "danger";
    case "22":
      return "success";
    case "4":
      return "success";
    case "3":
      return "danger";
    default:
      break;
  }
};
