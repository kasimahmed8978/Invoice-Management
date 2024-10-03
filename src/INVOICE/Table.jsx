import React from 'react';

function Table({list,Total}) {   

    
    return (
        <>
            <table width='100% ' className='mb-10'>
                <thead>
                    <tr className='bg-gray-100'>
                        <td className='font-bold' >Description</td>
                        <td className='font-bold' >Quantity</td>
                        <td className='font-bold' >Price</td>
                        <td className='font-bold' >Amount</td>
                    </tr>
                </thead>
                {list.map(({ id, Description, Quantity, Price, Amount }) => (
                    <React.Fragment key={id}>
                        <tbody>
                            <tr>
                                <td>{Description}</td>
                                <td>{Quantity}</td>
                                <td>{Price}</td>
                                <td>{Amount}</td>
                            </tr>
                        </tbody>
                    </React.Fragment>

                ))}
            </table>
            <div>
                
            <h2 className='text-gray-800 font-bold'>{Total.toLocaleString()}</h2>
            </div>
        </>
    );
}

export default Table;