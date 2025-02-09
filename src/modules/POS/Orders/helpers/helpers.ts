export const handleStatusBadge = (title: number) => {
  switch (title) {
    case 1:
      return "warning";
    case 2:
      return "success";
    case 3:
      return "danger";
    case 4:
      return "secondary";
    case 5:
      return "dark";
    case 6:
      return "info";
    case 7:
      return "outline";
    case 8:
      return "default";
    default:
      return "default";
  }
};

export const handleStatusBadgeDetails = (title: string) => {
  switch (title) {
    case "Pending":
      return "warning";
    case "Active":
      return "success";
    case "Declined":
      return "danger";
    case "Done":
      return "secondary";
    case "returned":
      return "dark";
    case "Joined":
      return "info";
    case "Void":
      return "outline";
    case "Draft":
      return "default";
    default:
      return "default";
  }
};
export const handleStatus = (statusNumber: number) => {
  switch (statusNumber) {
    case 1:
      return `Pending`;
    case 2:
      return `Active`;
    case 3:
      return `Declined`;
    case 4:
      return `Done`;
    case 5:
      return `Returned`;
    case 6:
      return `Joined`;
    case 7:
      return `Void`;
    case 8:
      return `Draft`;
    default:
      return "Unknown Status";
  }
};
