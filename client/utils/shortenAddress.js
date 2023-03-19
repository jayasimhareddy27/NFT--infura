export const shortenAddress = (address) => (
  `${address.substring(0, 5)}...${address.slice(address.length - 4)}`
);

export const address_Profile = (address) => (
  (Number(address.charAt(2))+Number(address.charAt(address.length-1)))%10
);
