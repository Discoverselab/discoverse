import { getCurrentInstance } from "@tarojs/taro";

interface O {
  [key: string]: any;
}
export function getSearchParams() : O {
  return getCurrentInstance()?.router?.params || {};
  // const search = window.location.search.substring(1);
  // const keyValueList = search.split('&');
  // const searchParam:O = {};
  // keyValueList.forEach((keyValue) => {
  //   const key = keyValue.split('=')[0];
  //   const value = keyValue.split('=')[1];
  //   if(typeof key === 'string') {
  //     searchParam[key] = value;
  //   }
  // })

  // return searchParam;

}