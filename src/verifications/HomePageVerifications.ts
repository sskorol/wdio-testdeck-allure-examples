import { expect } from 'chai'
import { step } from '../util/TestDecorators'
import { at } from '../util/PageFactory'
import { AbstractVerification } from './AbstractVerification'
import { HomePage } from '../page/HomePage'

export default class HomePageVerifications extends AbstractVerification<HomePage> {
  constructor() {
    super(at(HomePage))
  }

  @step((username: string) => `Verify that username is ${username}.`)
  public usernameIs(expectedUsername: string): HomePageVerifications {
    expect(`${this.actual.username}`).to.be.equal(expectedUsername)
    return this
  }
}
