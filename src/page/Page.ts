import { step } from '../util/TestDecorators'

export abstract class Page {
  @step((url: string) => `Open http://${process.env.HOST}/${url || ''}`)
  public open(path: string = ''): Page {
    browser.url(path)
    return this
  }

  protected whenFocused(element: WebdriverIO.Element): WebdriverIO.Element {
    browser.waitUntil(() => element.isFocused())
    return element
  }
}
