import React from 'react';

function Dates({InvoiceDate,InvoiceNumber,DueDate}) {
    return (
        <>
        <article className='my-5 flex items-end justify-end'>
                <ul>
                    <li className='p-1'><span className='font-bold'>Invoice Number:-</span>{InvoiceNumber}</li>
                    <li className='bg-gray-100'><span className='font-bold'>Invoice Date:-</span>{InvoiceDate}</li>
                    <li className='p-1'><span className='font-bold'>Due Date:-</span>{DueDate}</li>
                </ul>
            </article>
            
        </>
    );
}

export default Dates;