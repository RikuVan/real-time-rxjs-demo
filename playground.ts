import { Observable, Subject, map, merge, scan, shareReplay, tap, withLatestFrom } from 'rxjs'

import { log } from './lib/eyes'

console.clear()
log('Up and running')

const t = (a: number, b: number) => a + b

const test = new Observable<number>((subscriber) => {
  let i = 0
  const interval = setInterval(() => {
    i++
    subscriber.next(i)
  }, 1000)
  return () => {
    clearInterval(interval)
  }
})

const command = new Subject<number>()

const state: Observable<number[]> = merge(test, command).pipe(
  map((v: number) => v * 1000),
  scan((acc, val) => [...acc, val], []),
  shareReplay(1)
)

state.subscribe(log)
