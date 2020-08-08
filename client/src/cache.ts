import { InMemoryCache, makeVar } from "@apollo/client";

export const currentRoomVal = makeVar<string | null>(null);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentRoom: {
          read() {
            return currentRoomVal();
          },
        },
      },
    },
  },
});
