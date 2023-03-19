const https = require('https');
import React, { useState, useEffect } from 'react';

import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';

import { create } from 'ipfs-http-client';
import auth from './ipfs';

import { MarketAddress, MarketAddressABI } from './constants';

import parseTrasactions from '../utils/parseTrasactions'
import parseData from '../utils/parseData';

const client = create({  host: 'ipfs.infura.io',  port: 5001,  protocol: 'https',  headers: {      authorization: auth,  },});
const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [freq,setFreq]=useState({});
  const [limits,setLimits]=useState([0,0]);

  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const nftCurrency = 'ETH';
  const [usertransactions, setUsertransactions] = useState([]);

  
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) {
      return alert('Please install MetaMask');
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found');
    }
    //console.log({ accounts });
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      return alert('Please install MetaMask');
    }
    const i=Math.floor(Math.random() * 10) + 1;
    localStorage.setItem("ProfileImage", i)
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  const uploadToIPFS = async (file) => {
    try {
      const added=await client.add({content:file})
      const url=`https://ipfs.io/ipfs/${added.path}`;
      alert("image upload to p2p network: successfully!!! , image at url:-"+`${url}`);
      return url;
    } catch (error) {
      console.log(('Error uploading to IPFS', error));
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    const contract = fetchContract(signer);
    const listingPrice = await contract.getListingPrice();

    const transaction = !isReselling
      ? await contract.createToken(url, price, { value: listingPrice.toString() })
      : await contract.resellToken(id, price, { value: listingPrice.toString() });
    setIsLoadingNFT(true);
    await transaction.wait();
  };

  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;

    const data = JSON.stringify({ name, description, image: fileUrl });
    //console.log(data);
    try {
      alert('Wait while NFT being uploaded to IPFS')

      const added=await client.add(data);
      const url=`https://ipfs.io/ipfs/${added.path}`;
      alert('payment has been initiated please do open the metamask to see the transaction progress')

      await createSale(url, price);
      alert('payment Successfull!! NFT ADDED')

      router.push('/');
      console.log(url);
    } catch (error) {
      console.log(('Error uploading to IPFS', error));
    }
  };

  const fetchNFTs = async () => {

    setIsLoadingNFT(false);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = fetchContract(provider);

    const data = await contract.fetchMarketItems();
    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      
      const {data:stringdata}=await axios.get(tokenURI);
      const  { image, name, description } =(stringdata);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');
      
      return { price, tokenId: tokenId.toNumber(), seller, owner, image, name, description, tokenURI };
    }));
   // console.log(items);
    return items;
  };

  const fetchMyNFTsOrListedNFTs = async (type) => {
    setIsLoadingNFT(false);

    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);
    const data = type === 'fetchItemsListed'
      ? await contract.fetchItemsListed()
      : await contract.fetchMyNFTs();

    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const {data:stringdata}=await axios.get(tokenURI);
      const  { image, name, description } =(stringdata);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

      return { price, tokenId: tokenId.toNumber(), seller, owner, image, name, description, tokenURI };
    }));
    return items;
  };

  const buyNFT = async (nft) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    const transaction = await contract.createMarketSale(nft.tokenId, { value: price });
    setIsLoadingNFT(true);
    await transaction.wait();
    setIsLoadingNFT(false);
  };


const getAllNFTTransactions = async (id) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = fetchContract(provider);
  const availableTransactions = await contract.getUserTransactions(Number(id));
  
  const NFTtransactions=parseTrasactions(availableTransactions);
  setUsertransactions(NFTtransactions);

  const {F,max,min}=parseData(NFTtransactions);
  setFreq((prev)=>F);
  setLimits((prev)=>[max,min]);
};

  return (
    <NFTContext.Provider 
    value={{nftCurrency, currentAccount,isLoadingNFT,usertransactions,freq,limits,
            uploadToIPFS, createNFT, createSale, fetchNFTs,getAllNFTTransactions, fetchMyNFTsOrListedNFTs, buyNFT, connectWallet  }}>
      {children}
    </NFTContext.Provider>
  );
};
