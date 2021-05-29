import bent from "bent";
import * as consts from "./constants";

export const post = bent(
  `https://api.telegram.org/bot${consts.apiToken}/`,
  "POST",
  "json",
  200
);
