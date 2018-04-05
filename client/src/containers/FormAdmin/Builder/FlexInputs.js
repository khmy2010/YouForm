import React, { Component } from 'react';

class FlexInputs extends Component {
    constructor(props) {
        super(props);

        this.latestInput = null;

        this.setLatestInputRef = input => {
            this.latestInput = input;
        };

        this.focusLatestInput = () => {
            console.log('mehhhhh');
            console.log(this.latestInput);
            if (this.latestInput) this.latestInput.focus();
        };
    }

    componentDidUpdate() {
        if (this.props.latestFlex) {
            this.focusLatestInput();
        }
    }

    addField = event => {
        if (event.keyCode === 13) {
            this.props.onAdd();
        }
    };

    render() {
        const options = this.props.options;

        const flexInputs = options.map((option, index) => {
            const placeholder = `Option ${index + 1}`;
            const last = options.length - index === 1;
            return (
                <div className="EleField__FlexChoice" key={index}>
                    <input
                        type="text"
                        ref={this.setLatestInputRef}
                        value={option}
                        className="EleField__FlexInput"
                        placeholder={placeholder}
                        onKeyDown={last ? this.addField : null}
                        onChange={event => this.props.onChange(event, index)}
                    />
                    <span onClick={() => this.props.onRemove(index)}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            <path d="M0 0h24v24H0z" fill="none" />
                        </svg>
                    </span>
                </div>
            );
        });

        return flexInputs;
    }
}

export default FlexInputs;
