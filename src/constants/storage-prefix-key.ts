// This will contain all keys saved in the `localStorage`

const USER = () => `u`;
USER.regex = /^u-*/;

const LOGGED_IN_USER = () => 'l';
LOGGED_IN_USER.regex = /^l-*/;

const POST = () => `p`;
POST.regex = /^p-*/;

export const StoragePrefixKey = {
  USER,
  LOGGED_IN_USER,
  POST,
};
