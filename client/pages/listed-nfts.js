import React, { useState, useEffect, useContext } from 'react';

import { NFTContext } from '../context/NFTContext';
import { NFTCard, Loader,SearchBar,Pagination  } from '../components/index';

const ListedNFTs = () => {
  const { fetchMyNFTsOrListedNFTs } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeSelect, setActiveSelect] = useState('Recently added');
  const [nftsCopy, setNftsCopy] = useState([]);

  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case 'Price (low to high)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (high to low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'Recently added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelect]);
  const onHandleSearch = (value) => {
    const filteredNfts = nfts.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));

    if (filteredNfts.length) {
      setNfts(filteredNfts);
    } else {
      setNfts(nftsCopy);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  useEffect(() => {
    fetchMyNFTsOrListedNFTs('fetchItemsListed')
      .then((items) => {
        setNfts(items);
        setNftsCopy(items);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    <div className="flexStart min-h-screen">
      <Loader />
    </div>;
  }

  if (!isLoading && nfts.length === 0) {
    return (
      <div className="flexCenter sm:p-4 p-16 min-h-screen">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold">No NFTs Listed for Sale</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-12 sm:px-4 min-h-screen">
      <div className="w-full mimd:w-4/5">
        <div className="mt-4 p-2">
          <h2 className="font-poppins dark:text-white text-nft-black-1 text-2xl font-semibold mt-2 ml-4 sm:ml-2">NFTs Listed for Sale</h2>
          <div className="flex-2 sm:w-full flex flex-row sm:flex-col pt-4">
                  <SearchBar
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    handleSearch={onHandleSearch}
                    clearSearch={onClearSearch}
                  />
          </div>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} />).slice((page-1)*10,(page)*10)}
          </div>
          <Pagination page={page} setPage={setPage} totalPages={Math.ceil(nfts.length/10)}></Pagination>
        </div>
      </div>
    </div>
  );
};

export default ListedNFTs;
