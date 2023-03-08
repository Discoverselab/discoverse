export interface IEssenceMetadata {
  /* ~~ REQUIRED ~~ */
  /* Unique id for the issued item */
  metadata_id: string;

  /* Version of the metadata schema used for the issued item. */
  version: string;

  /* ~~ OPTIONAL ~~ */
  /* Id of the application under which the items are being minted. */
  app_id?: string;

  /* Language of the content as a BCP47 language tag. */
  lang?: string;

  /* Creation time of the item as ISO 8601. */
  issue_date?: string;

  /* The content associated with the item */
  content?: string;

  /* Media refers to any image, video, or any other MIME type attached to the content.
  Limited to max. 10 media objects. */
  media?: Media[];

  /* Field indicating the tags associated with the content. Limited to max. 5 tags. */
  tags?: string[];

  /* ~~ OPENSEA (optional) ~~ */
  /* URL to the image of the item. */
  image?: string;

  /* SVG image data when the image is not passed. Only use this if you're not 
  including the image parameter. */
  image_data?: string;

  /* Name of the item. */
  name?: string;

  /* Description of the item. */
  description?: string;

  /* URL to a multi-media attachment for the item. */
  animation_url?: string;

  /* Attributes for the item. */
  attributes?: Attribute[];

  /* URL to the item on your site. */
  external_url?: string;
}

export interface DetailDisplayData {
  id: string;
  essenceId: string;
  image: string;
  type: string;
  relationType: string;
  title: string;
  description: string;
  avatar: string;
  createTime: string;
  userName: string;
  addressStr: string;
  isCreator: boolean;
  isCollectedByMe: false;
  createCount: number;
  claimCount: number;
  remaining: number;
  contractAddress: string;
}

export interface ICollectedItem {
  profileID: string,
  avatar: string,
  handle: string,
  address: string,
  displayAddress: string,
}