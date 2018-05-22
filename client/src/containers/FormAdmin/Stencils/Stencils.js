import React, { Component } from 'react';

import axios from 'axios';

import './Stencils.css';

//components import
import Message from '../../../components/Message/Message';
import Field from '../../Fields/Field';
import Button from '../../../components/ContextButton/CButton';
import Dialog from '../../../components/Dialog/Dialog';

//images import
import magnifySVG from '../../../assets/images/magnify.svg';
import pencilSVG from '../../../assets/images/pencil.svg';

class Stencils extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stencils: [],
            active: null,
            message: '',
            showDeleteAll: false,
            loading: true
        };
    }
    componentDidMount() {
        axios.get('/api/stencils').then(res => {
            this.setState({ stencils: res.data, loading: false });
        });
    }

    setActiveStencil(sid) {
        this.setState({ active: sid, message: '' });
    }

    use = () => {
        const { stencils, active } = this.state;
        const question = stencils.find(({ _id }) => _id === active);
        const data = {
            ...question,
            sequence: this.props.length + 1
        };
        this.setState({ message: 'Added this into the list of questions.' });
        this.props.add(data);
    };

    delete = async () => {
        const { stencils, active } = this.state;
        const deleteSID = active;
        const filtered = stencils.filter(({ _id }) => _id !== active);
        this.setState({ stencils: filtered, active: null, message: '' });
        await axios.delete('/api/stencils', { data: { sid: deleteSID } });
    };

    deleteAll = async () => {
        this.setState({
            stencils: [],
            active: null,
            message: '',
            showDeleteAll: false
        });
        await axios.delete('/api/stencils/all');
    };

    renderStencils() {
        const { stencils, active } = this.state;

        if (stencils.length === 0) {
            return (
                <div className="Stencils__Preview__Prompt">
                    <img src={pencilSVG} alt="pencil" />
                    <h3>
                        It seems that you don't have any stencils yet. Why not
                        you go and save some?
                    </h3>
                </div>
            );
        }

        return stencils.map(({ title, _id }) => {
            let classes = ['Stencil__Item'];
            if (active && active === _id)
                classes.push('Stencil__Item__Selected');

            classes = classes.join(' ');

            return (
                <div
                    className={classes}
                    key={_id}
                    onClick={() => this.setActiveStencil(_id)}
                >
                    {title}
                </div>
            );
        });
    }

    renderField() {
        const { active, stencils } = this.state;
        if (active === null)
            return (
                <div className="Stencils__Preview__Prompt">
                    <img src={magnifySVG} alt="magnify" />
                    <h3>Please select a stencil to preview.</h3>
                </div>
            );

        const question = stencils.find(({ _id }) => _id === active);

        const parsedValidation = question.validation
            ? JSON.parse(question.validation)
            : {};

        const parsedOptions = question.options
            ? JSON.parse(question.options)
            : {};

        return (
            <Field
                component={question.type}
                title={question.title}
                description={question.description}
                validation={parsedValidation}
                options={parsedOptions}
                dateType={question.dateType}
                key={question._id}
            />
        );
    }

    renderControls() {
        if (this.state.active === null) return null;

        return (
            <div className="Stencils__Control">
                <Button context="CButton__Red" clicked={this.delete}>
                    Delete
                </Button>
                <Button context="CButton__Green" clicked={this.use}>
                    Use
                </Button>
            </div>
        );
    }

    renderMessage() {
        if (this.state.message.trim().length === 0) return null;
        return <div className="Stencils__Message">{this.state.message}</div>;
    }

    renderContent() {
        if (this.state.loading) return <Message show={this.state.loading} />;
        return (
            <React.Fragment>
                <div className="Stencils__Header">
                    <div>
                        List of private stencils{'   '}
                        <span>{this.state.stencils.length} in total</span>
                    </div>
                    <Button
                        context="CButton__Red"
                        clicked={() => this.setState({ showDeleteAll: true })}
                    >
                        Delete All
                    </Button>
                </div>
                <div className="Stencils__Content">
                    <div className="Stencils__List">
                        {this.renderStencils()}
                    </div>
                    <div className="Stencils__Preview">
                        {this.renderField()}
                        {this.renderMessage()}
                        {this.renderControls()}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    render() {
        if (!this.props.show) return null;

        return (
            <div className="Stencils">
                <div className="Stencils__Close" onClick={this.props.closed}>
                    Back to Question Builder
                </div>
                {this.renderContent()}
                <Dialog
                    show={this.state.showDeleteAll}
                    okay={this.deleteAll}
                    cancel={() => this.setState({ showDeleteAll: false })}
                    title="Delete forever?"
                >
                    All stencils are about to be permanently deleted.
                    <p className="Stencils__DeleteAll__Warning">
                        Warning: You can't undo this action.
                    </p>
                </Dialog>
            </div>
        );
    }
}

export default Stencils;
