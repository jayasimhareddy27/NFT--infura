import React from 'react';

const about = () => {
    return (
        <div>
            <h1 className='text-center text-3xl p-5 capitalize'>feature's and FAQ's</h1>
            <h2 className='text-base p-3 capitalize'>Features and technoloy used:</h2>
                <ul className='text-base pl-5 capitalize'>
                    <li>{'🔵 '}Create and trade the NFT's online with ease</li>
                    <li>{'🔵 '}optimised for SEO that is: search engines such as google can track the website with the data</li>
                    <li>{'🔵 '}sell or resell the token to earn money </li>
                    <li>{'🔵 '}nextjs provides serverside rendering which optimeses the client side data usage and power usage</li>
                </ul>
            <h2 className='text-base p-3 capitalize'>FAQ's:</h2>
                <ol type='A' className='text-base pl-5 capitalize'>
                    <li>{' '}how does it optimse the searhe engline?</li>
                    <li>{' '}how does it render server side ?</li>
                    <li>{' '}sell or resell the token to earn money ?</li>
                    <li >{' '}whats the need of decentralised ?</li>
                </ol>
        </div>
    );
};

export default about;