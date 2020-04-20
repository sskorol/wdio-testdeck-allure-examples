import { suite, test } from '@testdeck/mocha'
import { User } from '../model/User'
import { open } from '../util/PageFactory'
import { verifyThat } from '../verifications/AbstractVerification'
import atHomePage from '../verifications/HomePageVerifications'
import { data, feature, issue, Severity, severity, story, testCaseId } from '../util/TestDecorators'
import { GuestPage } from '../page/GuestPage'

@suite
class GitHubAuthTests {
  static authData = (): User[] => [new User(process.env.USERNAME, process.env.PASSWORD, process.env.FULL_NAME)]

  @severity(Severity.BLOCKER)
  @issue('ID-123')
  @testCaseId('ID-456')
  @feature('Authorization')
  @story('Implement GitHub login page.')
  @data(GitHubAuthTests.authData)
  @data.naming((user: User) => `${user.fullName} should be able to sign`)
  @test
  public userShouldBeAbleToSignIn(user) {
    open(GuestPage).signInWith(user).expandProfileMenu()
    verifyThat(atHomePage).usernameIs(user.username)
  }
}
