import React, {useContext, useEffect } from 'react';
import { NFTContext } from '../context/NFTContext';
import { shortenAddress } from '../utils/shortenAddress';



const Table=({nft})=>{
    const { getAllNFTTransactions,usertransactions } = useContext(NFTContext);
    useEffect(()=>{
      
      if(nft)
      getAllNFTTransactions(nft?.tokenId);
    },[nft])

    
    return(
            <> 
            <div className='flex justify-center self-center '>
            <table className='md:w-full md:h-full w-[75rem]'>
            <tr className=''>
              <th className='p-5 text-lg  md:text-base text-opacity-100 capitalize'>owner</th>
              <th className='p-5 text-lg  md:text-base text-opacity-100 capitalize'>seller</th>
              <th className='p-5 text-lg  md:text-base text-opacity-100 capitalize'>timestamp</th>
              <th className='p-5 text-lg  md:text-base text-opacity-100 capitalize'>price</th>
            </tr>
            {usertransactions.map((val, key) => {
              return (
                <tr key={key}>
                  <td  className='p-5 text-lg md:text-xs text-opacity-100 text-green-700'>{val.owner==="0x76031b5D75eb9e4c277aD06587e86ed1016005Ba"?"MARKET PLACE":shortenAddress(val.owner)}</td>
                  <td  className='p-5 text-lg md:text-xs text-opacity-100 text-red-700' >{val.seller==="0x76031b5D75eb9e4c277aD06587e86ed1016005Ba"?"MARKET PLACE":shortenAddress(val.seller)}</td>
                  <td  className='p-5 text-lg md:text-xs text-opacity-100 '>{(val.timestamp)}</td>
                  <td  className='p-5 text-lg md:text-xs text-opacity-100 '>{val.price} ETH</td>
                </tr>
              )
            })}
          </table>
            </div>     
            </>
        )
}
export default Table
