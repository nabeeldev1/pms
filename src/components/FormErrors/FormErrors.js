import React from 'react';

const FormErrors = ({formErrors}) =>

    <div className='formErrors'>
        {Object.keys(formErrors).map((fieldName, i) => {
            if(formErrors[fieldName].length > 0){
                return (
                    <p style={{ color: 'red' }} key={i}>{fieldName.slice(0,1).toUpperCase() + fieldName.slice(1, fieldName.length)} {formErrors[fieldName]}</p>
                )        
            } else {
                return '';
            }
        })}
  </div>

export default FormErrors;