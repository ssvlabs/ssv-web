export const shuffle = (array: any[]) => {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        // eslint-disable-next-line no-param-reassign
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
};

export const group = (array: any[]) => {
   return array.reduce((r, a) => {
        // eslint-disable-next-line no-param-reassign
        r[a.type] = [...r[a.type] || [], a];
        return r;
    }, {});
};