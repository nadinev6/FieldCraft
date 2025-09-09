// components/GroupField.js
import React from 'react';
import { FormFieldRenderer } from './FormFieldRenderer'; // Your existing field renderer

export const GroupField = ({ field }) => {
  // Handle columns layout
  if (field.columns) {
    return (
      <div className="grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${field.columns}, 1fr)`,
        gap: '16px'
      }}>
        {field.fields.map((childField, idx) => (
          <div key={idx} className="column">
            <FormFieldRenderer field={childField} />
          </div>
        ))}
      </div>
    );
  }

  // Default single-column layout
  return (
    <div className="group-container">
      {field.fields.map((childField, idx) => (
        <div key={idx} className="group-item">
          <FormFieldRenderer field={childField} />
        </div>
      ))}
    </div>
  );
};