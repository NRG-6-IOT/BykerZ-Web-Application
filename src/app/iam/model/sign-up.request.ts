export class SignUpRequest {
  public firstName: string;
  public lastName: string;
  public username: string;
  public email: string;
  public photoUrl: string;
  public password: string;
  public role: string

  constructor(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    photoUrl: string,
    password: string,
    role: string){
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.photoUrl = photoUrl;
    this.password = password;
    this.role = role;
  }
}
