export const getBadgeColor = (status: number | string) => {
  switch (status) {
    case 1:
      return "info";
    case 2:
      return "warning";
    case 11:
      return "success";
    case 12:
      return "danger";
    default:
      return "success";
  }
};
