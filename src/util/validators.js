export const onlyAlphaNumValues = (data) => {
    var regex = (/^[A-Za-z0-9]+$/);
    return (regex.test(data));
};

export const onlyNumericValues = (data) => {
    var regex = (/^[\d]*$/);
    return (regex.test(data));
};

export const validEmail = (data) => {
    var regex = (/^[\w]{1,25}@[\w]+[(.com)]+/);
    return (regex.test(data));
};