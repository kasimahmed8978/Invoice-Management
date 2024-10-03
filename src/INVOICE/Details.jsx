import React from 'react';

function Details({name,Address}) {
    return (
        <>
            <section className='flex items-end flex-col justify-end'>
                <h1 className='text-xl uppercase'>{name}</h1>
                {/* <p>{Address}</p> */}
            </section>
            {/* <section className='mt-5'>
                <h1 className='text-4xl uppercase'>Client Name</h1>
                <p>Client address</p>
            </section> */}

        </>
    );
}

export default Details;