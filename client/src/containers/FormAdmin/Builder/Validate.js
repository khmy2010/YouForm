import * as checker from '../../Fields/checker';

export const VBUILD = {
    REQ: 'required',
    NUM: 'number',
    MIN: 'choice_min',
    MAX: 'choice_max'
};

//only care about PASS or FAIL
//true = PASS
//false = FAIL
export const validateBuild = (vbuild, value, payload) => {
    const results = [];

    vbuild.forEach(rule => {
        if (rule === VBUILD.NUM) {
            results.push({
                rule,
                status: value === '' ? true : checker.numeric(value)
            });
        }

        if (rule === VBUILD.MIN) {
            const parsed = parseInt(value, 10);

            if (isNaN(parsed)) {
                results.push({
                    rule,
                    status: value === '' ? true : false
                });
            } else {
                results.push({
                    rule,
                    status:
                        parsed >= payload[VBUILD.MIN] &&
                        parsed <= payload[VBUILD.MAX]
                });
            }
        }

        if (rule === VBUILD.MAX) {
            const parsed = parseInt(value, 10);

            if (isNaN(parsed)) {
                results.push({
                    rule,
                    status: value === '' ? true : false
                });
            } else {
                results.push({
                    rule,
                    status: parsed <= payload[VBUILD.MAX]
                });
            }
        }
    });

    //evalute if the value pass vbuild configurations
    const pass = results.find(result => !result.status);

    return pass === undefined ? true : false;
};
