export interface IUserDto {
  username: string;
  name: string;
  registeredAt: Date;
}

export interface IRegisterUserDto {
  username: string;
  name: string;
  password: string;
}
