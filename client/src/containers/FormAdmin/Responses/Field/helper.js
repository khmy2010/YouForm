//given responses && options, build a dependency data for Graph
/*
    Expected Output:
    const data = [
      {name: 'Page A', uv: 4000},
      {name: 'Page B', uv: 3000},
      {name: 'Page C', uv: 2000},
      {name: 'Page D', uv: 2780},
      {name: 'Page E', uv: 1890},
      {name: 'Page F', uv: 2390},
      {name: 'Page G', uv: 3490},
    ];
*/

export const transformData = (responses, options) => {
    return options.map(({ option, oid }) => {
        const frequency = responses.reduce((acc, res) => {
            return res === oid ? acc + 1 : acc;
        }, 0);

        return { name: option, frequency };
    });
};
