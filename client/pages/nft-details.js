/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import images from '../assets';

import { address_Profile } from '../utils/shortenAddress';
import { NFTContext } from '../context/NFTContext';
import { shortenAddress } from '../utils/shortenAddress';
import { Loader, Button, Modal,FrequencyChart,PriceChart } from '../components';

import Table from '../components/Table';
const PaymentBodyCmp = ({ nft, nftCurrency }) =>{ 
  //console.log(nft);
  return(
  <div className="flex flex-col">
    <div className="flexBetween">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">Item</p>
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">Subtotal</p>
    </div>

    <div className="flexBetweenStart my-5">
      <div className="flex-1 flexStartCenter">
        <div className="relative w-28 h-28">
          <Image src={ nft.image || images[`nft${nft.i}`]} layout="fill" />
        </div>
        <div className="flexCenterStart flex-col ml-5">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">{shortenAddress(nft.seller)}</p>
          <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal">{nft.name}</p>
        </div>
      </div>

      <div>
        <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal">{nft.price} <span className="font-semibold">{nftCurrency}</span></p>
      </div>
    </div>

    <div className="flexBetween mt-10">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">Total</p>
      <p className="font-poppins dark:text-white text-nft-black-1 text-base minlg:text-xl font-normal">{nft.price} <span className="font-semibold">{nftCurrency}</span></p>
    </div>
  </div>
);}

const NFTDetails = () => {
  const { currentAccount, nftCurrency, buyNFT, isLoadingNFT } = useContext(NFTContext);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [nft, setNft] = useState({ image: '', tokenId: '', name: '', description: '', price: '', owner: '', seller: '' });
  const router = useRouter();

  const { limits} = useContext(NFTContext);
  useEffect(() => {
    if (!router.isReady) return;
    setNft(router.query);
    setIsLoading(false);

  
  }, [router.isReady]);

  if (isLoading) {
    <div className="flexStart min-h-screen">
      <Loader />
    </div>;
  }

  const checkout = async () => {
    await buyNFT(nft);

    setPaymentModal(false);
    setSuccessModal(true);
  };

  return (<>
    <div className="relative flex justify-center min-h-screen md:flex-col">
      <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
        <div className="relative w-557 h-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300">
          <img
            src={nft.image}
            className="rounded-xl shadow-lg"
            layout="fill"
          />
         <div className='md:p-2 flex gap-3 p-10'>
              <p className='rounded-lg shadow-md p-2 text-nft-black-4 bg-blue-300 inline-flex border-blue-400 border-dotted border-4 opacity-75'> Max Value ${limits[0]} Eth {' '} </p>
              <p className='rounded-lg shadow-md p-2 text-nft-black-4 bg-blue-300 inline-flex border-blue-400 border-dotted border-4 opacity-75'> {' '}Min Value ${limits[1]} Eth</p>
        </div>

        </div>
      </div>
      
      <div className="mt-11 flex-1 justify-start sm:px-4 p-12 sm:pb-4">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">{nft.name}</h2>
        </div>
        <div className="mt-9">
          <p className="ml-9 font-poppins dark:text-white text-nft-black-1 text-base minlg:text-base font-normal">Creator</p>
          <div className="flex flex-row items-center mt-3 ml-12">
            <div className="relative w-16 h-16 minlg:w-20 minlg:h-20 mr-2">
              <Image src={images[`creator${address_Profile(nft.seller)|| 1}`]} objectFit="cover" className="rounded-full" layout='fill' />
            </div>
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-semibold">{shortenAddress(nft.seller)}</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col">
          <div className="w-full border-b border-nft-black-1 dark:border-nft-gray-1 flex-flex-row">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base mb-2 minlg:text-base font-medium">Details</p>
          </div>
          <div className="mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal">{nft.description}</p>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col mt-10">
          {currentAccount === nft.seller.toLowerCase()
            ? (
              <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal border-gray p-2">You cannot buy your own NFT</p>
            ) : currentAccount === nft.owner.toLowerCase()
              ? (
                <Button btnName="List on MarketPlace" classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl" handleClick={() => router.push(`/resell-nft?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`)} />
              ) : (
                <Button btnName={`Buy for ${nft.price} ${nftCurrency}`} classStyles="mr-5 sm:mb-5 sm:mr-0 rounded-xl" handleClick={() => setPaymentModal(true)} />
              )}
        </div>
      </div>

      {paymentModal && (
        <Modal
          header="Check Out"
          body={<PaymentBodyCmp nft={nft} nftCurrency={nftCurrency} />}
          footer={(
            <div className="flex flex-row sm:flex-col">
              <Button btnName="Check Out" classStyles="mr-5 sm:mb-5 sm:mr-0 rounded-xl" handleClick={checkout} />
              <Button btnName="Cancel" classStyles="rounded-xl" handleClick={() => setPaymentModal(false)} />
            </div>
          )}
          handleClose={() => setPaymentModal(false)}
        />
      )}

      {isLoadingNFT && (
        <Modal
          header="Buying NFT..."
          body={(
            <div className="flexCenter flex-col text-center">
              <div className="relative w-52 h-52">
                <Loader />
              </div>
            </div>
          )}
        />
      )}

      {successModal && (
        <Modal
          header="Payment Successful"
          body={(
            <div className="flexCenter flex-col text-center" onClick={() => setSuccessModal(false)}>
              <div className="relative w-52 h-52">
                <Image layout='fill' src={nft.image}   />
              </div>
              <p className="font-poppins dark:text-white text-nft-black-1 mt-10 text-sm minlg:text-xl font-normal">You successfully purchased <span className="font-semibold">{nft.name} </span>from <span className="font-semibold">{shortenAddress(nft.seller)}</span></p>
            </div>
          )}
          footer={(
            <div className="flexCenter flex-col">
              <Button
                btnName="Check it out"
                classStyles="sm:mb-5 sm: mr-0 rounded-xl"
                handleClick={() => router.push('/my-nfts')}
              />
            </div>
          )}
          handleClose={() => setSuccessModal(false)}
        />
      )}
    </div >
        <div className='md:grid md:grid-rows-2 md:justify-around flex justify-center'>
            <FrequencyChart/>
            <PriceChart/>
        </div>
          <Table nft={nft}></Table>
          
    </>
  );
};

export default NFTDetails;
