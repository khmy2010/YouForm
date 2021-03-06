module.exports = {
    ERR_BAD_FID: {
        msg: 'ERR_00: Bad FID passed',
        code: 400
    },
    ERR_BAD_QID: {
        msg: 'ERR_01: Bad QID passed',
        code: 400
    },
    ERR_FILE_NOT_EXIST: {
        msg: 'ERR_02: File does not exist.',
        code: 404
    },
    ERR_FORM_CLOSED: {
        msg: 'ERR_04: Form has been closed by the owner.',
        code: 403
    },
    ERR_FORM_NOTSTART: {
        msg: 'ERR_05: Form has not ready for visitor.',
        code: 403
    },
    ERR_FORM_ENDED: {
        msg: 'ERR_06: Form has expired.',
        code: 403
    }
};
