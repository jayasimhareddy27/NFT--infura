const parseTrasactions=(availableTransactions)=>{
    const str=[];

    for(let i=0;i<availableTransactions.length;i++){
        if(parseInt(availableTransactions[i].price._hex) / (10 ** 18)!==0){
            str.push({
            id: parseInt(availableTransactions[i][0]._hex),//transaction.tokenId,
            seller: availableTransactions[i].seller,
            owner: availableTransactions[i].owner,
            timestamp: new Date(availableTransactions[i].timestamp.toNumber() * 1000).toLocaleString(),
            price: parseInt(availableTransactions[i].price._hex) / (10 ** 18)
            });
        }
    }
    return str;

}
export default parseTrasactions;