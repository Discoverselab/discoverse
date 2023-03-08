export const CREATE_COLLECT_ESSENCE_TYPED_DATA = `
  mutation CreateCollectEssenceTypedData(
    $input: CreateCollectEssenceTypedDataInput!
  ) {
    createCollectEssenceTypedData(input: $input) {
      typedData {
        id
        sender
        data
        nonce
      }
    }
  }
`;
