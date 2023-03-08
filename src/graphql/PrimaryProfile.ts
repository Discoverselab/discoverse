export const PRIMARY_PROFILE = `
  query PrimaryProfile($address: AddressEVM!) {
    address(address: $address) {
      wallet {
        primaryProfile {
          id
          profileID
          handle
          metadata
          avatar
          isPrimary
        }
      }
    }
  }
`;
