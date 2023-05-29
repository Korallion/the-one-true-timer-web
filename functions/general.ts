export function deleteIdFromArray(id: number, array: number[]) {
    const index = array.findIndex((value: number) => value === id);
    const newArray = [...array];
    newArray.splice(index, 1);

    return newArray;
}

export function addIdToArray(array: number[]) {
    if (array.length !== 0) {
        const newItem = array[array.length - 1] + 1;
        let newArray = [...array, newItem];

        return newArray;
    }

    return [1];
}