export const formatName = (firstName: string, lastName: string): string => {
    // get first initial of first name and last name
    const firstInitial = firstName?.charAt(0)?.toUpperCase();
    const lastInitial = lastName?.charAt(0)?.toUpperCase();

    return `${firstInitial}${lastInitial}`;
};
