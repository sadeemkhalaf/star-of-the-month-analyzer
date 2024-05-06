export const reformatNameString = (value: string) => value.toLocaleLowerCase().replace(' ', '');
export const reformatName = (value: string) => value.toLocaleLowerCase().split(',').reverse().join().replace(' ', '').replace(',', '');
export const validateNameFormat = (value: string) => value?.includes(',') ? value.split(', ').reverse().join(' ').replace(',', '') : value