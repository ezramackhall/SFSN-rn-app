export const convertDate = (dateToConvert) => { 
    const convertedDate = new Date(dateToConvert).toLocaleDateString('en-EN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    return convertedDate;
}

export const trimTime = (date)  => {
    const tokens = date.split(',');
    const returnDate = tokens[0] + ',' + tokens [1];
    return returnDate;
}

export const trimDate = (date)  => {
    const tokens = date.split(',');
    const returnDate = tokens[2];
    return returnDate;
}