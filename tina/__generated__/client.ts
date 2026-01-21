import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '4bf988c33e8dd7dd055cfc9e09c19a5373bd7e9e', queries,  });
export default client;
  