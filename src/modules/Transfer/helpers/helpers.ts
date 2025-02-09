export const handleStatusAll = (status: number) => {
  switch (status) {
    case 1:
      return "Requested";
    case 2:
      return "Incoming";
    case 3:
      return "Sent";
    case 4:
      return "Received";
    case 5:
      return "Rejected";
    case 6:
      return "Rejected";
    default:
      break;
  }
};

export const handleStatus = (status: number) => {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Pending";
    case 3:
      return "Completed";
    case 4:
      return "Completed";
    case 5:
      return "Rejected";
    case 6:
      return "Request Rejected";
    default:
      break;
  }
};
export const handleType = (status: number) => {
  switch (status) {
    case 1:
      return "Sending";
    case 2:
      return "Receiving";
    case 4:
      return "Request";

    default:
      break;
  }
};

export const handleTypeColor = (status: number) => {
  switch (status) {
    case 1:
      return "info";
    case 2:
      return "info";
    case 3:
      return "success";
    case 4:
      return "success";
    case 5:
      return "danger";
    case 6:
      return "danger";

    default:
      break;
  }
};
