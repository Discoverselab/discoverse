
export const LOGIN_VERIFY = `
    mutation LoginVerify($input: LoginVerifyInput!) {
        loginVerify(input: $input) {
            accessToken
        }
    }
`;
