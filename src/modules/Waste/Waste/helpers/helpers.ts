export const handleType = (number: string) => {
    switch (number) {
        case "business_date":
            return "Date";
        case "reason.name":
            return "Reason";
        case "poster.name":
            return "Logged by";
        default:
            return "Item";
    }
};

