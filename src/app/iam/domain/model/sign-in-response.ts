export class SignInResponse {
  public id: number;
  public username: string;
  public token: string;
  public roles: string[];
  constructor(id: number, username: string, token: string, roles: string[]) {
    this.id = id;
    this.username = username;
    this.token = token;
    this.roles = roles;
  }
}
