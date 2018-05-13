import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Loading from '../../components/Preloading/Preloading';
import Button from '../../components/ContextButton/CButton';
import User from '../../components/User/User';
import Item from '../../components/Dash/Item/Item';
import Details from '../../components/Dash/Details/Details';
import Dialog from '../../components/Dialog/Dialog';
import Message from '../../components/Message/Message';

import Share from '../../components/Share/Share';

import './Dash.css';
import * as actions from '../../actions/dash';
import { downloadResponses } from '../../utils';

class Dash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            newName: '',
            showing: null,
            showShare: false,
            showNew: false,
            showRename: false,
            showDelete: false
        };

        this.cycleSelection = this.cycleSelection.bind(this);
    }

    componentDidMount() {
        this.props.fetchForms(this.props.loaded);
        document.addEventListener('keydown', this.cycleSelection);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.cycleSelection);
    }

    createNewForm = async () => {
        const formData = { name: this.state.name, updated: Date.now() };
        try {
            const res = await axios.post('/api/forms/new', formData);
            this.openForm(res.data._id);
        } catch (error) {
            console.log(error);
        }
    };

    openForm = fid => {
        this.props.history.push(`/app/admin/${fid}`);
    };

    showDetails = fid => {
        this.setState({
            showing: fid
        });
    };

    cycleSelection(evt) {
        //40: down, 38: up
        const { keyCode } = evt;
        const { forms } = this.props;
        const DOWN_KEY = 40;
        const UP_KEY = 38;

        if (forms.length <= 1) return;

        const update = index => {
            if (index >= forms.length) return;
            this.setState({
                showing: forms[index]._id
            });
        };

        const { showing } = this.state;
        const find = () => forms.findIndex(({ _id }) => _id === showing);

        if (keyCode === DOWN_KEY) {
            if (showing === null) update(0);
            else {
                const index = find();
                //reach the end, go back
                update(index === forms.length - 1 ? 0 : index + 1);
            }
        }

        if (keyCode === UP_KEY) {
            if (showing === null) return;
            const index = find();
            update(index === 0 ? forms.length - 1 : index - 1);
        }
    }

    toggleShare = () => {
        this.setState((prevState, props) => {
            return { showShare: !prevState.showShare };
        });
    };

    toggleRename = () => {
        this.setState((prevState, props) => {
            return {
                showRename: !prevState.showRename,
                newName: ''
            };
        });
    };

    toggleDelete = () => {
        this.setState((prevState, props) => {
            return {
                showDelete: !prevState.showDelete
            };
        });
    };

    renameForm = async () => {
        await this.props.renameForm(this.state.showing, this.state.newName);
        this.toggleRename();
    };

    handleChange = evt => {
        const { name, value } = evt.target;
        this.setState({ [name]: value });
    };

    download = () => {
        downloadResponses(this.state.showing);
    };

    deleteForm = async () => {
        const fid = this.state.showing;
        this.setState({ showing: null }, this.toggleDelete);
        await this.props.deleteForm(fid);
    };

    renderFormItems() {
        if (this.props.forms === null) {
            return null;
        }

        const formsArray = this.props.forms.map(form => {
            const fid = form._id;
            let active = false;

            if (fid === this.state.showing) active = true;

            return (
                <Item
                    key={fid}
                    {...form}
                    clicked={() => this.showDetails(fid)}
                    active={active}
                    dbclicked={() => this.openForm(fid)}
                />
            );
        });

        return formsArray;
    }

    renderDetails() {
        const selected = this.state.showing;
        if (selected === null) return null;

        const { forms } = this.props;
        const data = forms.find(({ _id }) => _id === selected);
        return <Details {...data} />;
    }

    renderButtons() {
        if (this.state.showing === null) return null;
        return (
            <div className="Dashboard__Actions">
                <Button
                    context="CButton__Green"
                    clicked={() => this.openForm(this.state.showing)}
                >
                    Open
                </Button>
                <Button clicked={this.toggleShare}>Share Link</Button>
                <Button context="CButton__Orange" clicked={this.toggleRename}>
                    Rename
                </Button>
                <Button context="CButton__Red" clicked={this.toggleDelete}>
                    Delete
                </Button>
            </div>
        );
    }

    renderShare() {
        if (this.state.showShare === false) return null;
        return (
            <Share
                show={this.state.showShare}
                cancel={this.toggleShare}
                fid={this.state.showing}
                formData={this.props.forms.find(
                    ({ _id }) => _id === this.state.showing
                )}
                okay={this.toggleShare}
            />
        );
    }

    renderNew() {
        if (this.state.showNew === false) return null;
        return (
            <Dialog
                title="Create New Form"
                show={this.state.showNew}
                okay={this.createNewForm}
            >
                <span className="Dialog__Desc">Insert file name here</span>
                <input
                    type="text"
                    className="Dash__NewInput"
                    value={this.state.name}
                    onChange={this.handleChange}
                    name="name"
                />
            </Dialog>
        );
    }

    renderRename() {
        const { showing, showRename } = this.state;
        if (showRename === false || showing === null) return null;

        const form = this.props.forms.find(({ _id }) => _id === showing);
        console.log(form);
        return (
            <Dialog
                title={`Rename ${form.name}`}
                show={this.state.showRename}
                okay={this.renameForm}
                cancel={this.toggleRename}
            >
                <span className="Dialog__Desc">Insert new form name here</span>
                <input
                    type="text"
                    className="Dash__NewInput"
                    value={this.state.newName}
                    onChange={this.handleChange}
                    name="newName"
                    placeholder={form.name}
                />
            </Dialog>
        );
    }

    renderDelete() {
        const { showing, showDelete } = this.state;
        if (showDelete === false || showing === null) return null;

        const form = this.props.forms.find(({ _id }) => _id === showing);

        const downloadButton = (
            <Button key="Download" clicked={this.download}>
                Export Responses
            </Button>
        );

        return (
            <Dialog
                title={`Delete ${form.name}?`}
                show={this.state.showDelete}
                okay={this.deleteForm}
                cancel={this.toggleDelete}
                buttons={downloadButton}
                otext="Proceed"
            >
                <div className="Dash__ConfirmDelete">
                    <p className="Dash__ConfirmDelete__Desc">
                        This form is about to be permanently deleted.
                    </p>
                    <p className="Dash__ConfirmDelete__Emp">
                        Warning: You can't undo this action.
                    </p>
                    <p className="Dash__ConfirmDelete__Download">
                        You may download a copy of responses before deleting it.
                    </p>
                </div>
            </Dialog>
        );
    }

    render() {
        if (this.props.loading) return <Loading show />;
        return (
            <React.Fragment>
                <div className="Dashboard">
                    <div className="Dashboard__Toolbar">
                        <div className="Toolbar__Buttons">
                            <Button
                                clicked={() => this.setState({ showNew: true })}
                            >
                                New Form
                            </Button>
                            <Button
                                clicked={() =>
                                    this.props.history.push(`/discovery`)
                                }
                            >
                                Discover
                            </Button>
                        </div>
                        <User info={this.props.auth} />
                    </div>
                    <div className="Dashboard__Header">
                        <div className="Dashboard__Header__Name">Form Name</div>
                        <div className="Dashboard__Header__Details">
                            Details
                        </div>
                    </div>
                    <div className="Dashboard__Content">
                        <div className="Dashboard__Files">
                            {this.renderFormItems()}
                        </div>
                        <div className="Dashboard__Details">
                            {this.renderDetails()}
                            {this.renderButtons()}
                        </div>
                    </div>
                </div>
                {this.renderShare()}
                {this.renderNew()}
                {this.renderDelete()}
                {this.renderRename()}
                <Message show={this.props.operating ? true : false} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        ...state.dash
    };
};

export default connect(mapStateToProps, actions)(withRouter(Dash));
