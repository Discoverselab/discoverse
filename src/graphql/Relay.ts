export const RELAY = `
  mutation Relay($input: RelayInput!) {
    relay(input: $input) {
      relayActionId
    }
  }
`;
