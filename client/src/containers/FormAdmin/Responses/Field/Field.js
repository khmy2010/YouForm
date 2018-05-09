import React, { Component } from 'react';

import { typeCheck } from '../../../../utils';

import './Field.css';

import Text from '../Text/Text';

//this is a wrapper class.
class Field extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderGraph() {}

    renderTextResponse() {
        const { responses } = this.props;
        console.log(responses);

        return responses.map((response, index) => {
            return <Text key={index} value={response} />;
        });
    }

    render() {
        return (
            <section className="Responses__Field">
                <div className="RField__Sequence">1</div>
                <div className="RField__Wrapper">
                    <div className="RField__Title">What's your name?</div>
                    <div className="RField__Stats">
                        12 out of 12 person answered this question.
                    </div>
                    <div className="RField__Summary">
                        {typeCheck.isExtendedChoice(this.props.type)
                            ? this.renderGraph()
                            : this.renderTextResponse()}
                    </div>
                </div>
            </section>
        );
    }
}

export default Field;
