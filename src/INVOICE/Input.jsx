import React from 'react';

function Input({value,setvalue,labels,types,Holder}) {
     const handleChange = (e) => {
        setvalue(e.target.value);
    };
    return (
        <div className='flex border p-2 flex-wrap m-2'>
            <label className='pr-5' htmlFor="name">{labels}</label><br />
            <input 
            className='border p-1'
            type={types}
            name='text'
            id='text'
            placeholder={Holder}
            autoComplete='off'
            value={value}
            onChange={handleChange}/>
        </div>
    );
}

export default Input;