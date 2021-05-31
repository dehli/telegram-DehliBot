import bent from "bent";

export const post = (apiToken: string) => bent(
  `https://api.telegram.org/bot${apiToken}/`,
  "POST",
  "json",
  200
);
