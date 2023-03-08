import axios from "axios";
import { env } from "@/constants/env";

const apiKey = env.NEXT_PUBLIC_API_KEY || "";
const apiSecret = env.NEXT_PUBLIC_API_SECRET || "";

export async function pinJSONToIPFS(json: { [key: string]: any }) {
  const data = JSON.stringify(json);
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

  return axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
    })
    .then((response) => response.data.IpfsHash)
    .catch((error) => {
      throw error;
    });
}
