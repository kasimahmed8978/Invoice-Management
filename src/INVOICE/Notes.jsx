import React from 'react';

function Notes({Note}) {
    return (
        <>
            <section className=' mt-10 mb-5'>
                <p className='lg:w-1/2'><span className='font-bold'>Notes:-</span> {Note}</p>
            </section>
        </>
    );
}

export default Notes;