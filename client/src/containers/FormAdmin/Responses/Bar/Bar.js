import React from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const barChart = ({ data }) => {
    return (
        <BarChart
            width={700}
            height={400}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="name" />
            <YAxis
                interval={1}
                allowDecimals={false}
                label={{
                    value: 'Responses received',
                    angle: -90,
                    position: 'insideLeft'
                }}
            />
            <Tooltip />
            <Bar dataKey="frequency" fill="#8884d8" />
        </BarChart>
    );
};

export default barChart;
