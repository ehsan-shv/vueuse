import type { Awaitable } from '@vueuse/shared'

export interface StorageLikeAsync {
  getItem(key: string): Awaitable<string | null>
  setItem(key: string, value: string): Awaitable<void>
  removeItem(key: string): Awaitable<void>
}

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

/**
 * @expiremental The API is not finalized yet. It might not follow semver.
 */
export interface SSRHandlersMap {
  getDefaultStorage: () => StorageLike | undefined
  getDefaultStorageAsync: () => StorageLikeAsync | undefined
  updateHTMLAttrs: (selector: string, attribute: string, value: string) => void
}

const _global = globalThis || this

const globalKey = '__vueuse_ssr_handlers__'
// @ts-expect-error
_global[globalKey] = _global[globalKey] || {}
// @ts-expect-error
const handlers: Partial<SSRHandlersMap> = _global[globalKey]

export function getSSRHandler<T extends keyof SSRHandlersMap>(key: T, fallback: SSRHandlersMap[T]): SSRHandlersMap[T]
export function getSSRHandler<T extends keyof SSRHandlersMap>(key: T, fallback: SSRHandlersMap[T] | undefined): SSRHandlersMap[T] | undefined
export function getSSRHandler<T extends keyof SSRHandlersMap>(key: T, fallback?: SSRHandlersMap[T]): SSRHandlersMap[T] | undefined {
  return handlers[key] as SSRHandlersMap[T] || fallback
}

export function setSSRHandler<T extends keyof SSRHandlersMap>(key: T, fn: SSRHandlersMap[T]) {
  handlers[key] = fn
}
