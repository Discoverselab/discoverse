export const ESSENCES_BY_FILTER = `
  query essencesByFilter($appID: String, $metadataID: String, $me: AddressEVM!) {
    essenceByFilter(appID: $appID, metadataID: $metadataID) {
      essenceID
      id
      tokenURI
      contractAddress
      createdBy {
        avatar
        handle
        profileID
        metadata
      }
      metadata {
        description
        name
        image
        attributes {
          display_type
          value
          trait_type
        }
        issue_date
      }
      isCollectedByMe(me: $me)
      collectedBy {
        edges {
          node {
            wallet {
              address
              primaryProfile {
                avatar
                handle
              }
            }
          }
        }
      }

    }
  }
`;
