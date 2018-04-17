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
            selectedIndex: this.props.default ? 0 : null
        };
        //if there is init value, prioritise that first
        if (this.props.default && this.props.init) {
            this.state.value = this.props.init;
        }

        if (this.props.default && !this.props.init) {
            this.state.value = this.props.options[0].display;

            //simulate click event for default value
            this.props.clicked(this.state.value);
        }

        if (!this.props.default && this.props.init) {
            this.state.value = this.props.init;
        }

        this.handleMouseClose = this.handleMouseClose.bind(this);
    }

    handleMouseClose(event) {
        if (
            event.target.nodeName !== 'svg' &&
            !event.target.className.includes('Select') &&
            this.state.isOpen
        )
            this.setState({ isOpen: false });
    }

    componentDidMount() {
        // window.colorLog('SELECT: Mount already');
        document.addEventListener('click', this.handleMouseClose);
    }

    componentWillUnmount() {
        // window.colorLog('SELECT: Unmount already', 'red');
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
        const value = this.props.options[index].display;
        this.setState({
            value,
            selectedIndex: index
        });
        this.props.clicked(value, index, this.props.options[index].value);
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
