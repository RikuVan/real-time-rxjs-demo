import eyes from 'eyes'

const styles = Object.assign({}, (eyes as any).defaults.styles, {
  all: 'grey',
  string: 'red',
  label: 'yellow',
  key: 'cyan',
  bool: 'green',
  regexp: 'magenta',
  special: 'green',
})

const isNil = (x: any) => x === undefined || x === null

const when = (pred: Function, f: Function) => (x: any) => !!pred(x) ? f(x) : x

const hasInspect = (x: any) => !isNil(x) && typeof x.inspect === 'function'

const inspect = when(hasInspect, (x: any) => x.inspect())

const write = eyes.inspector({ styles })

export function log(...args) {
  if (!args.length) {
    write(undefined)
    return undefined
  } else if (args.length > 1) {
    write(inspect(args[1]), args[0])
    return args[1]
  }

  write(inspect(args[0]))
  return args[0]
}
