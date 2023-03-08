import axios from "axios";
import IPFS from "ipfs-mini";

const parseURL = (url: string) => {
  if (!url) return "";
  const str = url.substring(0, 4);

  if (str === "http") {
      return url;
  } else {
      // return `https://gateway.pinata.cloud/ipfs/${url}`;
      return `https://discoverse.oss-cn-hangzhou.aliyuncs.com/metadata/cyberconnect/${url}.json`
  }
};

export async function getMetadata(ipfsHash: string): Promise<any> {
  let metadata;
  try {
    // const res = await fetch(parseURL(ipfsHash));
    const res = await axios.get(parseURL(ipfsHash)).catch(e => e);
    if(res instanceof Error) {
      // const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
 
      // ipfs.catJSON(ipfsHash, (err, result) => {
      //   console.log('ipfs mini', err, result);
      // });
    } else {
      console.log('getMetadata', res)
      if (res.status === 200) {
        metadata = res.data;
      }

    }
  } catch (error) {
    console.error(error);
  }
  return metadata;
}

export function getMetadataAttribute(attributes, type) {
  let value;
  const item = (attributes || []).find(attribute => attribute.trait_type === type);
  if(item) {
    if(item.display_type === 'number') {
      value = parseInt(item.value, 10);
    } else {
      value = item.value;
    }
  }
  return value;
}