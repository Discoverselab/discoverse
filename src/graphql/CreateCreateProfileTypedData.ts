export const CREATE_CREATE_PROFILE_TYPED_DATA = `
    mutation CreateCreateProfileTypedData($input: CreateCreateProfileTypedDataInput!) {
        createCreateProfileTypedData(input: $input) {
            typedDataID
        }
    }
`;
