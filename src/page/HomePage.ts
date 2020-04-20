import { Page } from './Page'

export class HomePage extends Page {
  public expandProfileMenu(): HomePage {
    $('header summary>img.avatar').click()
    return this
  }

  public get username(): string {
    return $('.dropdown-menu a[role=menuitem]>strong').getText()
  }
}
