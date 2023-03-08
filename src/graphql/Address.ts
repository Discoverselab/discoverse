export const ADDRESS = `
  query Address($address: AddressEVM!) {
    address(address: $address) {
      wallet {
        address
        profiles {
          totalCount
          edges {
            node {
              id
              profileID
              handle
              metadata
              avatar
              isPrimary
              essences {
                totalCount
                edges {
                  node {
                    essenceID
                    tokenURI
                    createdBy {
                      handle
                      metadata
                      avatar
                      profileID
                    }
                  }
                }
              }
            }
            cursor
          }
        }
        collectedEssences {
          totalCount
          edges {
            node {
              essence {
                essenceID
                tokenURI
                metadata {
                  image
                  description
                  metadata_id
                  name
                  attributes {
                    display_type
                    trait_type
                    value
                  }
                  issue_date
                }
                createdBy {
                  handle
                  metadata
                  avatar
                  profileID
                  owner {
                    address
                  }
                }
                collectedBy {
                  edges {
                    node {
                      wallet {
                        primaryProfile {
                          avatar
                          handle
                          profileID
                        }
                        address
                      }
                    }
                  }
                }
              }
            }
          }
        }
        primaryProfile {
          avatar
          handle
          essences {
            edges {
              node {

                  essenceID
                  tokenURI
                  metadata {
                    image
                    description
                    metadata_id
                    name
                    attributes {
                      display_type
                      trait_type
                      value
                    }
                    issue_date
                  }
                  createdBy {
                    handle
                    metadata
                    avatar
                    profileID
                    owner {
                      address
                    }
                  }
                  collectedBy {
                    edges {
                      node {
                        wallet {
                          primaryProfile {
                            avatar
                            handle
                            profileID
                          }
                          address
                        }
                      }
                    }
                  }
              }
            }
          }
        }
      }
    }
  }
`;
