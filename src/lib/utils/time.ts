export const timeDiffCalc = (dateFuture: any, dateNow: any) => {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;

    let difference = '';
    if (days >= 1) {
        difference += days === 1 ? `${days} day ` : `${days} days `;
    }
    if (hours >= 1) {
        difference += hours === 1 ? `${hours} hour ` : `${hours} hours`;
    } else if (minutes >= 1) {
        difference += minutes === 1 ? `${minutes} minute ` : `${minutes} minutes`;
    } else {
        difference += 'less than a minute';
    }
    return difference;
};
