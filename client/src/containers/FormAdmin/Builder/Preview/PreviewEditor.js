import React from 'react';

import './Preview.css';

const previewEditor = props => {
    return (
        <div className="Builder__PreviewEditor">
            {props.children}
            <div className="PreviewEditor__Controls">
                <button
                    className="PreviewEditor__Button PreviewEditor__Red"
                    onClick={props.onDeleteQuestion}
                >
                    Delete
                </button>
                <button
                    className="PreviewEditor__Button PreviewEditor__Blue"
                    onClick={props.onSaveStencil}
                >
                    Save
                </button>
                <button
                    className="PreviewEditor__Button PreviewEditor__Green"
                    onClick={props.onEditQuestion}
                >
                    Edit
                </button>
                {/* <input className="PreviewEditor__Sequence" value="1" /> */}
            </div>
        </div>
    );
};

export default previewEditor;
