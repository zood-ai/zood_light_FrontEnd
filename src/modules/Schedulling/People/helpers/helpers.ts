export const handleStatus = (status: number) => {
    switch (status) {
        case 1:
            return "Not Invited";
        case 2:
            return "Invited";
        case 3:
            return "Providing Documents";
        case 4:
            return "Ready for approval";
        case 5:
            return "Registered";
        case 6:
            return "Deactivated";
        case 7:
            return "Expired";
        default:
            break;
    }
};

export const handleStatusShap = (status: number) => {
    switch (status) {
        case 1:
            return "danger";
        case 2:
            return "success";
        case 3:
            return "info";
        case 4:
            return "success";
        case 5:
            return "success";
        case 6:
            return "danger";
        case 7:
            return "danger";

        default:
            break;
    }
};
