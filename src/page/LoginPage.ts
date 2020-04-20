import { User } from '../model/User'
import { at } from '../util/PageFactory'
import { step } from '../util/TestDecorators'
import { HomePage } from './HomePage'
import { Page } from './Page'

export class LoginPage extends Page {
  public signInWith(user: User): HomePage {
    return this.fillInUsernameOrEmail(user.username).fillInPassword(user.password).clickSignInButton()
  }

  @step((usernameOrEmail) => `Fill in username or email: ${usernameOrEmail}.`)
  public fillInUsernameOrEmail(usernameOrEmail: string): LoginPage {
    this.whenFocused($('#login_field')).setValue(usernameOrEmail)
    return this
  }

  @step((password) => `Fill in password: ${password}.`)
  public fillInPassword(password: string): LoginPage {
    $('#password').setValue(password)
    return this
  }

  @step('Click "Sign in" button.')
  public clickSignInButton(): HomePage {
    $('input[type=submit]').click()
    return at(HomePage)
  }
}
