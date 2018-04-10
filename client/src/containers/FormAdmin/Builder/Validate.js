import * as checker from '../../Fields/checker';

export const VBUILD = {
    REQ: 'required',
    NUM: 'number',
    MIN: 'choice_min',
    MAX: 'choice_max',
    MIN_CHAR: 'minCharCount',
    MAX_CHAR: 'maxCharCount'
};

//only care about PASS or FAIL
//true = PASS
//false = FAIL

export const validateBuild = (vbuild, value, payload) => {
    const results = [];
    const parsed = parseInt(value, 10);

    //function to handle empty field, return false for further processing.
    const handleEmpty = rule => {
        if (isNaN(parsed)) {
            results.push({
                rule,
                status: value === '' ? true : false
            });
            return true;
        }

        return false;
    };

    vbuild.forEach(rule => {
        if (rule === VBUILD.NUM) {
            results.push({
                rule,
                status: value === '' ? true : checker.numeric(value)
            });
        }

        if (rule === VBUILD.MIN && !handleEmpty(rule)) {
            results.push({
                rule,
                status:
                    parsed >= payload[VBUILD.MIN] &&
                    parsed <= payload[VBUILD.MAX]
            });
        }

        if (rule === VBUILD.MAX && !handleEmpty(rule)) {
            results.push({
                rule,
                status: parsed <= payload[VBUILD.MAX]
            });
        }

        if (rule === VBUILD.MIN_CHAR && !handleEmpty(rule)) {
            results.push({
                rule,
                status: parsed > 0
            });
        }

        if (rule === VBUILD.MAX_CHAR && !handleEmpty(rule)) {
            //only check when both rules are of the same length
            if (value.length < payload[VBUILD.MAX_CHAR].length) {
                results.push({
                    rule,
                    status: true
                });
            } else {
                let parsedMinCharCount = parseInt(payload[VBUILD.MAX_CHAR], 10);

                if (isNaN(parsedMinCharCount)) {
                    parsedMinCharCount = 0;
                }

                results.push({
                    rule,
                    status: parsed > parsedMinCharCount
                });
            }
        }
    });

    //evalute if the value pass vbuild configurations
    const pass = results.find(result => !result.status);

    return pass === undefined ? true : false;
};
