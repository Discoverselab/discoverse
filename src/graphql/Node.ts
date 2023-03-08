import { gql } from "@apollo/client";

export const NODE = gql`
    query Node($nodeId: ID!) {
        node(id: $nodeId) {
            ... on Essence {
                essenceID
                id
                name
                symbol
                tokenURI
                collectedBy {
                    edges {
                        node {
                            wallet {
                                primaryProfile {
                                    profileID
                                    handle
                                    metadata
                                    avatar
                                    isPrimary
                                }
                            }
                        }
                    }
                }
                createdBy {
                    profileID
                }
            }
        }
    }
`;
