import { ICollectedItem } from "./essence";

export type Profile = {
  name?: string;
  avatar: string;
  handle: string;
  id: string;
  isPrimary: boolean;
  metadata: string;
  profileID: number;
}

/* Metadata schema for Profile NFT */
export interface IProfileMetadata {
  name: string;
  bio: string;
  handle: string;
  version: string;
}



export interface IRelationDisplayData {
  metadataId: string,
  relationType: string,
  relationName: string,
  typeIconImage: string,
  createTime: string,
  collectedList: ICollectedItem[],
  betweenIcon: string,
}