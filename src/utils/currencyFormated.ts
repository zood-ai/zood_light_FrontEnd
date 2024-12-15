export const currencyFormated = (num: number) => { 
    console.log(num , " : THIS IS A NUMBER");
    console.log(typeof num , " : THIS IS A TYPEOF FORM");
    const newFormeted = new Intl.NumberFormat('en-GB').format(num);
    return newFormeted;
}