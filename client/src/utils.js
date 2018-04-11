export const CONSTS = {
    TYPE: {
        SHORT_TEXT: 'SHORT_TEXT',
        LONG_TEXT: 'LONG_TEXT',
        EMAIL: 'EMAIL',
        DROPDOWN: 'DROPDOWN',
        SINGLE_CHOICE: 'SINGLE_CHOICE',
        MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
        YES_NO: 'YES_NO',
        DATE: 'DATE',
        NUMBER: 'NUMBER',
        CURRENCY: 'CURRENCY',
        LINK: 'LINK'
    },
    DATE_TYPE: {
        LONG_MDY: 'MM/DD/YYYY',
        LONG_DMY: 'DD/MM/YYYY',
        LONG_YMD: 'YYYY/MM/DD'
    },
    ERROR: {
        ERR_BAD_FID: 'ERR_00: Bad FID passed',
        ERR_BAD_QID: 'ERR_01: Bad QID passed',
        ERR_FILE_NOT_EXIST: 'ERR_02: File does not exist.',
        ERR_FORM_CLOSED: 'ERR_04: Form has been closed by the owner.'
    }
};

export const typeCheck = {
    isMultipleChoice: props => props === CONSTS.TYPE.MULTIPLE_CHOICE,
    isSingleChoice: props => props === CONSTS.TYPE.SINGLE_CHOICE,
    isChoice: props =>
        typeCheck.isMultipleChoice(props) || typeCheck.isSingleChoice(props),
    isYesNo: props => props === CONSTS.TYPE.YES_NO,
    isExtendedChoice: props =>
        typeCheck.isChoice(props) || typeCheck.isYesNo(props),
    isAloneChoice: props =>
        typeCheck.isSingleChoice(props) || typeCheck.isYesNo(props),
    isDate: props => props === CONSTS.TYPE.DATE,
    isShortText: props => props === CONSTS.TYPE.SHORT_TEXT,
    isLongText: props => props === CONSTS.TYPE.LONG_TEXT,
    isText: props => typeCheck.isShortText(props) || typeCheck.isLongText(props)
};

export const isDev = () => window.location.host === 'localhost:3000';

export const getBase = () => {
    if (isDev()) return window.location.host;
    else return window.location.protocol + '//' + window.location.host;
};
