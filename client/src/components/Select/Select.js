import React, { Component } from 'react';

import './Select.css';

//possible props: [] of options
//default?
//click handler
class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            value: '',
            selectedIndex: null
        };

        this.handleMouseClose = this.handleMouseClose.bind(this);
    }

    handleMouseClose(event) {
        //Select is a "hack" namespace, since vanila namespace is convoluted
        //detect any clicks apart from Select field
        if (!event.target.className.includes('Select')) {
            this.setState({
                isOpen: false
            });
        }
    }

    componentDidMount() {
        //to make it reusable, we need to listen to document clicks and filter
        document.addEventListener('click', this.handleMouseClose);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleMouseClose);
    }

    renderOldSelect() {
        const select = this.props.options.map(({ value, display }, index) => {
            return (
                <option key={index} value={value}>
                    {display}
                </option>
            );
        });

        return <select>{select}</select>;
    }

    renderNewSelect() {
        const select = this.props.options.map(({ value, display }, index) => {
            let optionStyle = ['Select__Item'];
            const selectedIndex = this.state.selectedIndex;

            if (selectedIndex && selectedIndex === index) {
                optionStyle.push('Select__Item__Selected');
            }

            optionStyle = optionStyle.join(' ');

            return (
                <li
                    className={optionStyle}
                    key={index}
                    value={value}
                    onClick={() => this.handleClick(index)}
                >
                    {display}
                </li>
            );
        });

        let styles = ['Select__Items'];

        if (!this.state.isOpen) {
            styles.push('Select__Hide');
        }

        styles = styles.join(' ');

        return <ul className={styles}>{select}</ul>;
    }

    handleClick = index => {
        this.setState({
            value: this.props.options[index].display,
            selectedIndex: index
        });
        this.toggle();
    };

    renderSelected() {
        let styles = ['Select__Selected'];
        let selected = null;

        if (this.state.isOpen) {
            styles.push('Select__Active');
        }

        styles = styles.join(' ');

        if (this.state.value === '') {
            selected = 'Please select a value.';
        } else {
            selected = this.state.value;
        }

        return (
            <div className={styles} onClick={this.toggle}>
                {selected}
            </div>
        );
    }

    toggle = () => {
        this.setState((prevState, props) => ({
            isOpen: !prevState.isOpen
        }));
    };

    render() {
        return (
            <div className="Y__Select">
                {this.renderOldSelect()}
                {this.renderSelected()}
                {this.renderNewSelect()}
            </div>
        );
    }
}

export default Select;
