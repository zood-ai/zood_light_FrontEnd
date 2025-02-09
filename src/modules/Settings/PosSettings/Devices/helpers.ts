export const getDevicesType = (type: number) => {
    switch (type) {
        case 1:
            return "Cashier";
        case 2:
            return "KDS";
        case 4:
            return "Notifier";
        case 5:
            return "Display";
        case 6:
            return "Sub Cashier";
        case 7:
            return "Dashboard";
        default:
            return "-";
    }
};


export const getDevicesStatus = (status: number) => {
    switch (status) {
        case 1:
            return "Used";
        case 0:
            return "Not Used";
        default:
            return "-";
    }
};



export const deviceType = [
   
    {
      value: "1",
      label: 'Cashier',
    },
    {
      value: "2",
      label: 'KDS',
    },
    {
      value: "4",
      label: 'Notifier',
    },
    {
      value: "5",
      label: 'Display',
    },
    {
      value: "6",
      label: 'Sub Cashier',
    },
    {
      value: "7",
      label: 'Dashboard',
    },
  ];