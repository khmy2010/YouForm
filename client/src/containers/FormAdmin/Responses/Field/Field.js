import React, { Component } from 'react';

import './Field.css';

import { typeCheck } from '../../../../utils';
import { transformData } from './helper';

import Text from '../Text/Text';
import Bar from '../Bar/Bar';
import Type from '../../../../components/Responses/Type/Type';
import NoResponse from '../../../../components/Responses/NoResponse/NoResponse';

//this is a wrapper class.
class Field extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderGraph() {
        const { responses, options } = this.props;
        return <Bar data={transformData(responses, JSON.parse(options))} />;
    }

    renderTextResponse() {
        const { responses } = this.props;

        return responses.reverse().map((response, index) => {
            return <Text key={index} value={response} />;
        });
    }

    renderStats() {
        const { count } = this.props;
        const total = this.props.totalResponses;

        let message = null;

        if (count === 0) message = 'Nobody answered this question (yet).';
        else if (count < total)
            message = `${count} out of ${total} person answered this question.`;
        else if (count === total) message = `Everyone answered this question.`;

        return (
            <div className="RField__Stats">
                {message}
                <Type type={this.props.type} />
            </div>
        );
    }

    renderContent() {
        if (this.props.count === 0) return <NoResponse />;
        return typeCheck.isExtendedChoice(this.props.type)
            ? this.renderGraph()
            : this.renderTextResponse();
    }

    render() {
        return (
            <section className="Responses__Field">
                <div className="RField__Sequence">{this.props.sequence}</div>
                <div className="RField__Wrapper">
                    <div className="RField__Title">{this.props.title}</div>
                    {this.renderStats()}
                    <div className="RField__Summary">
                        {this.renderContent()}
                    </div>
                </div>
            </section>
        );
    }
}

export default Field;
