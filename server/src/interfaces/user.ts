export interface User {
    id: string
    traits: {
      email: string,
      name: {
        first: string,
        last: string,
      }
    }
};
