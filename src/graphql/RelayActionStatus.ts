export const RelayActionStatus = `
  query RelayActionStatus($relayActionId: ID!) {
    relayActionStatus(relayActionId: $relayActionId) {
      ... on RelayActionStatusResult {
        returnData {
          ... on RegisterEssenceReturnData {
            essenceID
            essenceMw
            essenceTokenURI
            name
            prepareReturnData
            profileID
            symbol
          }
        }
        txHash
        txStatus
      }
      ... on RelayActionError {
        lastKnownTxHash
        reason
      }
      ... on RelayActionQueued {
        queuedAt
        reason
      }
    }
  }
`;
