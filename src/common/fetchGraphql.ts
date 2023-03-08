import {env} from '@/constants/env';

let token = '';
export function setToken(_token: string) {
  token = _token;
}
export function hasToken() {
  return !!token;
}
export default async function fetchGraphql(query, variables) {
  console.log('token', token);
  return fetch(env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token ? `bearer ${token}` : "",
      "X-API-KEY": env.NEXT_PUBLIC_CYBERCONNECT_API_KEY,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((response) => response.json());
}