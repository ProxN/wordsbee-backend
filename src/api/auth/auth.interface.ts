export interface ISign {
  email: string;
  password: string;
}

export interface IsignUpBody extends ISign {
  fullname: string;
}

export interface IUpdatePassBody {
  userId: string;
  newPass: string;
  oldPass: string;
}
