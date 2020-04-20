## WDIO examples

This repository is an example of a basic UI-test for GitHub, based on [WDIO](https://github.com/webdriverio/webdriverio) framework and [ts-test-decorators](https://github.com/sskorol/ts-test-decorators) concept.

Decorators were a bit updated as [mocha-typescript](https://www.npmjs.com/package/mocha-typescript) was deprecated in favor of a new [testdeck](https://github.com/testdeck/testdeck) library.

Sample test case written in OOP-manner:
```ts
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
```

### Installation

Preparations:
```shell script
docker pull aerokube/selenoid:latest-release
docker pull aerokube/selenoid-ui:latest-release
docker pull selenoid/vnc:chrome_81.0
git clone https://github.com/sskorol/wdio-testdeck-allure-examples.git
cd ./wdio-testdeck-allure-examples
npm install
docker-compose up -d
```
Add required environment variables (use a preferred editor):
```shell script
nano .env
```
```dotenv
HOST=github.com
USERNAME=yourGitHubId
PASSWORD=yourGitHubPassword
FULL_NAME=yourFullName
```
```shell script
CTRL+o
ENTER
CTRL+x
```
Update `./src/resources/allure.properties` with your own information:
```text
allure.issues.tracker.pattern=https://path.to.your.tracker/browse/%s
allure.tests.management.pattern=https://path.to.your.tms/browse/%s
```
### Execution and Reporting
Run existing test in a docker container:
```shell script
npm run test
```
Generate and render Allure report:
```shell script
npm run allure-report
```
