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
