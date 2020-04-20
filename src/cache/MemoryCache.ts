import { CacheClass } from 'memory-cache'

export function cacheObject<K, V>(key: K, value: V): V {
  return (getCachedObject(key) || getCache().put(key, value)) as V
}

export function getCachedObject<K, V>(key: K): V {
  return getCache().get(key) as V
}

function getCache<K, V>(): CacheClass<K, V> {
  // @ts-ignore
  return global.cache
}
