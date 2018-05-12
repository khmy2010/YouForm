import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Loading from '../../components/Preloading/Preloading';
import Button from '../../components/ContextButton/CButton';
import User from '../../components/User/User';
import Item from '../../components/Dash/Item/Item';
import Details from '../../components/Dash/Details/Details';

import './Dash.css';
import * as actions from '../../actions/dash';

class Dash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            showing: null
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

    render() {
        if (this.props.loading) return <Loading show />;
        return (
            <div className="Dashboard">
                <div className="Dashboard__Toolbar">
                    <div className="Toolbar__Buttons">
                        <Button>New Form</Button>
                        <Button>Discover</Button>
                    </div>
                    <User info={this.props.auth} />
                </div>
                <div className="Dashboard__Header">
                    <div className="Dashboard__Header__Name">Form Name</div>
                    <div className="Dashboard__Header__Details">Details</div>
                </div>
                <div className="Dashboard__Content">
                    <div className="Dashboard__Files">
                        {this.renderFormItems()}
                    </div>
                    <div className="Dashboard__Details">
                        {this.renderDetails()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        forms: state.dash.forms,
        loading: state.dash.loading
    };
};

export default connect(mapStateToProps, actions)(withRouter(Dash));
