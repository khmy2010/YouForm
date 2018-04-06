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
        CURRENCY: 'CURRENCY'
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
        typeCheck.isMultipleChoice(props) || typeCheck.isSingleChoice(props)
};
