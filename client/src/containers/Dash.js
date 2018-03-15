import React, { Component } from 'react';
import { connect } from 'react-redux';

class Dash extends Component {
    render() {
        return (
            <div>
                <button>Create New Form</button>
            </div>
        );
    }
}

const mapStateToProps = state => {};

export default connect(mapStateToProps, null)(Dash);
