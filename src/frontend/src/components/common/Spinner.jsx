import React from 'react';
import './Spinner.css';

function Spinner({ label = 'Loading...', className = '' }) {
    return (
        <span className={`spinner-inline ${className}`.trim()} aria-live="polite" aria-label={label}>
            <span className="spinner" aria-hidden="true" />
            <span className="spinner-label">{label}</span>
        </span>
    );
}

export default Spinner;
