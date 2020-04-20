import { Page } from '../page/Page'

export class AbstractVerification<T> {
  constructor(protected readonly actual: T) {}
}

export function verifyThat<T extends Page, R extends AbstractVerification<T>>(instance: new () => R): R {
  return new instance()
}
