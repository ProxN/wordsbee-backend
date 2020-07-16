declare namespace Express {
  export interface Request {
    currentUser: import('../../src/api/users/interfaces').IUser;
  }
}
