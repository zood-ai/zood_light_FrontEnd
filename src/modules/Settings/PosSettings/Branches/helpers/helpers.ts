export const handleStatus = (status: number) => {
    switch (status) {
        case 1:
            return 'Cashier';
        case 2:
            return 'KDS';
        case 4:
            return 'Notifier';
        case 5:
            return 'Display';
        case 6:
            return 'Sub Cashier';
        case 7:
            return 'Dot One Cashier';


        default:
            break;
    }
}
