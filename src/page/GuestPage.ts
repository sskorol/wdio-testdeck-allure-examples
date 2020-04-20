import { User } from '../model/User'
import { at } from '../util/PageFactory'
import { HomePage } from './HomePage'
import { LoginPage } from './LoginPage'
import { Page } from './Page'

export class GuestPage extends Page {
  public signInWith(user: User): HomePage {
    $("a[href='/login']").click()
    return at(LoginPage).signInWith(user)
  }
}
