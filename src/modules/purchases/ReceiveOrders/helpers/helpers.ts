export const handleStatus = (status: string) => {
  switch (status) {
    case "1":
      return "Draft";
    case "2":
      return "Requested";
    case "3":
      return "Canceled";
    case "4":
      return "Closed";
    case "22":
      return "Incoming";
    case "21":
      return "Rejected";
    default:
      break;
  }
};

export const handleStatusShap = (status: string) => {
  switch (status) {
    case "1":
      return "outline";
    case "2":
      return "info";
    case "3":
      return "danger";
    case "4":
      return "success";
    case "22":
      return "info";
    case "21":
      return "danger";
    default:
      break;
  }
};
