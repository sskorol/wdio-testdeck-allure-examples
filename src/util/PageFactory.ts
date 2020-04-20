import { cacheObject } from '../cache/MemoryCache'
import { Page } from '../page/Page'

export function open<T extends Page>(PageClass: new () => T): T {
  return at(PageClass).open() as T
}

export function at<T extends Page>(PageClass: new (...args: any[]) => T, ...args: any[]): T {
  return cacheObject(PageClass.name, typeof PageClass === 'function' ? new PageClass(args) : PageClass)
}
