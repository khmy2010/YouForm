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

//returns true if later is "later" then earlier date.
export const isFresh = (earlier, later) => later - earlier > 0;

export const redoSequence = (questions, seq, ori, qid) => {
    //it always end with duplicating sequence
    const endIndex = questions.findIndex(
        ({ sequence }, index) => sequence === seq && index !== ori - 1
    );

    //leave an error console for easier debugging in the future
    if (endIndex === -1) console.error('endIndex is undefined.');

    const updated = questions.map((question, index) => {
        //down case
        if (seq - ori > 0) {
            if (index <= ori - 1 || index > endIndex) return question;
            question.sequence -= 1;
        }
        //up case
        else {
            if (index >= ori - 1 || index < endIndex) return question;
            question.sequence += 1;
        }

        return question;
    });

    //after updating, sort the array according to the new sequence
    const sorted = updated.sort((a, b) => a.sequence - b.sequence);

    return sorted;
};

export const deleteSequence = questions => {
    let doRequest = true;

    //given qid, find the end index
    const deletedIndex = questions.findIndex(({ sequence }, index) => {
        return sequence !== index + 1;
    });

    //not found because deleted question is the last question
    if (deletedIndex === -1) doRequest = false;

    //found, updating sequence (always down case)
    //if not found, the questions will copied again
    const updated = questions.map((question, index) => {
        if (index < deletedIndex) return question;
        return {
            ...question,
            sequence: question.sequence - 1
        };
    });

    return { doRequest, updated };
};

export const updateConnected = (questions, deletedQID) => {
    let doRequest = false;

    const updated = questions.map(question => {
        //don't touch question without logics attached
        if (!typeCheck.isSingleChoice(question.type)) return question;

        const connect = JSON.parse(question.connect);
        if (connect.length === 0) return question;

        //remove affected QID that is attached to the question
        question.connect = connect.filter(({ key, qid }) => qid !== deletedQID);

        //some logic is connected
        if (question.connect.length !== connect.length && !doRequest)
            doRequest = true;

        question.connect = JSON.stringify(question.connect);

        return question;
    });

    console.log(doRequest);

    return { updated, doRequest };
};

export const scanLogic = (questions, sequence, connect) => {
    let res = true;

    //nothing to check when logic doesn't exist.
    if (connect.length === 0) return res;

    //check for duplicating keys
    res = !isDuplicateExist(connect.map(({ key }) => key));

    //check for logic sequence
    connect.forEach(({ qid }) => {
        const target = findByQID(questions, qid);

        if (target && target.sequence <= sequence) res = false;
    });

    return res;
};

//seq: sequence of the question
//qid: qid of connected logic
//questions: array of questions at the form
export const isValidLogic = (originSequence, qid, questions) => {
    //identify the sequence of QID at the array of questions
    const { sequence } = findByQID(questions, qid);

    if (sequence === undefined) return false;

    //if it is identified, make sure it comes AFTER
    return sequence > originSequence;
};

export const purify = (questions, sequence, connect) => {
    let unique = null;

    //remove all duplicates
    if (isDuplicateExist(connect.map(({ key }) => key))) {
        unique = connect.reduce((acc, value) => {
            const length = acc.length;

            if (length === 0 || acc[length - 1] !== value.key) acc.push(value);

            return acc;
        }, []);
    } else unique = [...connect];

    //remove logic that points to latter question
    return unique.filter(
        ({ qid }) => findByQID(questions, qid).sequence > sequence
    );
};

export const isDuplicateExist = arr =>
    removeDuplicate(arr).length !== arr.length;

export const removeDuplicate = arr =>
    arr.reduce((accumulator, current) => {
        const length = accumulator.length;

        if (length === 0 || accumulator[length - 1] !== current) {
            accumulator.push(current);
        }

        return accumulator;
    }, []);

export const findByQID = (questions, qid) =>
    questions.find(({ _id }) => qid === _id);
