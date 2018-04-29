export const findCurrentResponse = (target, responses) =>
    responses.find(({ qid }) => qid === target);
