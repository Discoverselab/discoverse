export const CREATE_REGISTER_ESSENCE_TYPED_DATA = `
  mutation CreateRegisterEssenceTypedData(
    $input: CreateRegisterEssenceTypedDataInput!
  ) {
    createRegisterEssenceTypedData(input: $input) {
      typedData {
        id
        sender
        data
        nonce
      }
    }
  }
`;
