import axios from 'axios';

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

export const db = {
    getQuestions: async fid => {
        if (fid === undefined)
            return Promise.reject('db.getQuestions() requires FID');
        try {
            const res = await axios.get(`/api/forms/${fid}/questions`);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    },
    override: async (fid, questions) => {
        if (fid === undefined || questions === undefined)
            return Promise.reject('db.override() requires FID');
        try {
            await axios.put(`/api/forms/${fid}/questions`, questions);
        } catch (error) {
            console.error(error);
        }
    }
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
    let doDeleteRequest = true;

    //given qid, find the end index
    const deletedIndex = questions.findIndex(({ sequence }, index) => {
        return sequence !== index + 1;
    });

    //not found because deleted question is the last question
    if (deletedIndex === -1) doDeleteRequest = false;

    //found, updating sequence (always down case)
    //if not found, the questions will copied again
    const updated = questions.map((question, index) => {
        if (index < deletedIndex) return question;
        return {
            ...question,
            sequence: question.sequence - 1
        };
    });

    return { doDeleteRequest, updated };
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
    //remove all duplicates
    const unique = connect.reduce((acc, value) => {
        const length = acc.length;

        if (length === 0 || acc[length - 1].key !== value.key) acc.push(value);

        return acc;
    }, []);

    //remove logic that points to latter question
    return unique.filter(
        ({ qid }) => findByQID(questions, qid).sequence > sequence
    );
};

export const purifyAll = questions => {
    let doRequest = false;

    const purified = questions.map(question => {
        //don't process if it is not single choice
        if (!typeCheck.isSingleChoice(question.type)) return question;

        const parsedConnect = JSON.parse(question.connect);
        //don't process if it don't have any connected field
        if (parsedConnect.length === 0) return question;

        parsedConnect.forEach(({ _id, qid }) => {
            if (!isValidLogic(question.sequence, qid, questions))
                doRequest = true;
        });

        if (doRequest)
            question.connect = JSON.stringify(
                purify(questions, question.sequence, parsedConnect)
            );

        return question;
    });

    return {
        doRequest,
        questions: purified
    };
};

//this function should work without given QID.
export const updateConnected = questions => {
    let doUpdateRequest = false;

    if (questions.length === 0) return { doUpdateRequest, filtered: questions };

    //build a map for questions
    const map = new Map(
        questions.reduce((acc, { _id, sequence }) => {
            acc.push([_id, sequence]);
            return acc;
        }, [])
    );

    //1. check for duplicating logic
    //2. make sure the connected question is placed latter
    //3. make sure all logics connected to a valid question

    const filtered = questions.map(question => {
        //don't process if it is not single choice
        if (!typeCheck.isSingleChoice(question.type)) return question;

        const parsedConnect = JSON.parse(question.connect);
        //don't process if it don't have any connected field
        if (parsedConnect.length === 0) return question;

        const filteredConnect = parsedConnect.reduce((acc, logic) => {
            const sequence = map.get(logic.qid);
            const length = acc.length;

            //check if connected logic exists
            //check if it is latter than current question
            if (sequence && sequence > question.sequence) {
                if (length === 0 || acc[length - 1].key !== logic.key)
                    acc.push(logic);
            }

            return acc;
        }, []);

        if (parsedConnect.length !== filteredConnect) doUpdateRequest = true;

        question.connect = JSON.stringify(filteredConnect);

        return question;
    });

    return {
        doUpdateRequest,
        filtered
    };
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

export const findBySequence = (questions, targetSequence) =>
    questions.find(({ sequence }) => targetSequence === sequence);

/*
    Source:
    https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript/5344074#5344074
*/
export const deepClone = ori => JSON.parse(JSON.stringify(ori));

export const checkIntegrity = (latest, { map, questions, responses }) => {
    /*
        valid(pin): true
        value(pin): "dfsdfdsfsd"
        type(pin): "LONG_TEXT"
        qid(pin): "5ae7d56e174e03033af1b65f"
        selected(pin): null
    */

    //check if the questions has changed since saved
    return deepClone(responses).reduce((acc, response) => {
        const { value, qid, selected } = response;

        //first check: check if the question still exist
        const latestQuestion = findByQID(latest, qid);
        if (latestQuestion === undefined) return acc;

        const savedQuestion = findByQID(questions, qid);

        const latestValidation = JSON.parse(latestQuestion.validation);
        const savedValidation = JSON.parse(savedQuestion.validation);

        let res = true;
        let processed = { ...response };

        //do checking for choice question
        if (typeCheck.isExtendedChoice(savedQuestion.type)) {
            //check if option name has changed
            const savedOptions = getOptions(JSON.parse(savedQuestion.options));
            const latestOptions = getOptions(
                JSON.parse(latestQuestion.options)
            );

            if (savedOptions.length !== latestOptions.length) res = false;
            else {
                //there might be just a change of option name
                let modified = [];
                selected.forEach(option => {
                    modified.push(latestOptions[option]);
                });
                modified = modified.join(', ');
                //replace it with newly changed value if it is not the same
                if (modified !== value) processed.value = modified;
            }
        }
        //do checking for non-logic attached question
        else {
            //check for min char count
            const latestMinCharCount = latestValidation.minCharCount;
            const savedMinCharCount = savedValidation.minCharCount;
            if (latestMinCharCount !== savedMinCharCount) res = false;

            //check for isRequired
            //if it is not required at latest, then it is fine
            const latestRequired = latestValidation.isRequired;
            const savedRequired = savedValidation.isRequired;
            if (latestRequired !== savedRequired) {
                if (latestRequired && !savedRequired) res = false;
            }
        }

        if (res) acc.push(processed);

        return acc;
    }, []);
};

export const getOptions = options => {
    return options ? options.map(({ option }) => option) : null;
};

//given an index, get the OID
export const getOID = (options, index) => {
    return options ? options[index].oid : null;
};
