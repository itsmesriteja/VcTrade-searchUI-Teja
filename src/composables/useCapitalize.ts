// Capitalize Helper function
export function useCapitalize() {
    const capitalizeFirstLetters = (str: string) => {
        return str.toLowerCase().replace(/^\w|\s\w/g, (letter) => letter.toUpperCase());
    };

    return { capitalizeFirstLetters };
}