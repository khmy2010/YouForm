//RULES:
//RETURN TRUE = PASS VALIDATION
//RETURN FALSE = FAIL VALIDATION

//because all fields need this validation
//but not all fields will required key in to validate.
export const required = value => value.trim().length !== 0;

export const email = email => {
    //ignore Unncessary escape character warning
    //eslint-disable-next-line
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(email);
};

export const minLength = (value, minLength) => value.trim().length >= minLength;

export const maxLength = (value, maxLength) => value.trim().length <= minLength;

//https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
//this function will NOT do type check.
//should this test pass, it is caller's responsibility to perform type check
export const numeric = value => !isNaN(parseFloat(value)) && isFinite(value);

export const currency = value => {
    if (typeof value === 'string') {
        value = parseFloat(value);
    }
    const regex = /^\d*(\.\d{0,2})?$/;
    return regex.test(value);
};

//make sure the min is an integer
export const checkChoiceMin = (selected, min) => {
    //if rule not defined, return true right away
    return !min ? true : selected.length >= min;
};

//make sure the max is an integer
export const checkChoiceMax = (selected, max) => {
    //if rule not defined, return true right away
    return !max ? true : selected.length <= max;
};
