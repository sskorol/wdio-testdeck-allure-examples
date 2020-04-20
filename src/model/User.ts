export class User {
  constructor(readonly username: string = '', readonly password: string = '', readonly fullName: string = '') {}

  public toString(): string {
    return this.fullName
  }
}
