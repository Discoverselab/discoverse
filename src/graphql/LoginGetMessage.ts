export const LOGIN_GET_MESSAGE = `
    mutation LoginGetMessage($input: LoginGetMessageInput!) {
        loginGetMessage(input: $input) {
            message
        }
    }
`;
