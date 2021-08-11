export function dynamicSort(property: any) {
    let sortOrder = 1;

    if (property[0] === '-') {
        sortOrder = -1;
        // eslint-disable-next-line no-param-reassign
        property = property.substr(1);
    }

    return (a: any, b: any) => {
        if (sortOrder === -1) {
            return b[property].localeCompare(a[property]);
        }
            return a[property].localeCompare(b[property]);
    };
}