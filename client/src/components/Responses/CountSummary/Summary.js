import React from 'react';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';

const questionSummary = ({ data, total }) => {
    const formatXAxis = tickItem => {
        return `Question ${tickItem}`;
    };

    const formatTooltip = (value, name, props) => {
        return `${value} out of ${total}`;
    };

    return (
        <LineChart
            width={800}
            height={400}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 10 }}
        >
            <XAxis dataKey="sequence" tickFormatter={formatXAxis} />
            <YAxis />
            <CartesianGrid strokeDasharray="2 2" />
            <Tooltip separator=" received: " formatter={formatTooltip} />
            <Line
                type="monotone"
                dataKey="responses"
                stroke="#2d72d9"
                activeDot={{ r: 8 }}
            />
        </LineChart>
    );
};

export default questionSummary;
