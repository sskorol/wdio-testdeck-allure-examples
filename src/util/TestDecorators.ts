/**
 * This code was partially cloned from testdeck/core package and improved to support missing features.
 */
const nodeSymbol: (key: string) => string = (key): string => '__testdeck_' + key
const testNameSymbol: string = nodeSymbol('name')
const parametersSymbol: string = nodeSymbol('parametersSymbol')
const nameForParametersSymbol: string = nodeSymbol('nameForParameters')

type Params = object | Function
type Execution = undefined | 'pending' | 'only' | 'skip' | 'execution'
type TestDecorator = (target: object, property: string, descriptor: PropertyDescriptor) => PropertyDescriptor
type ParamsDecorator = (params: Params, name?: string) => TestDecorator

interface ParameterizedPropertyDescriptor extends PropertyDescriptor {
  (params: Params, name?: string): MethodDecorator

  skip(params: Params, name?: string): MethodDecorator

  only(params: Params, name?: string): MethodDecorator

  pending(params: Params, name?: string): MethodDecorator

  naming(nameForParameters: (params: Params) => string): MethodDecorator
}

export enum Severity {
  BLOCKER = 'blocker',
  CRITICAL = 'critical',
  NORMAL = 'normal',
  MINOR = 'minor',
  TRIVIAL = 'trivial',
}

export const data: ParameterizedPropertyDescriptor = makeParamsObject()

export function step<T>(nameFn: string | ((arg: T) => string)): TestDecorator {
  return processDecorator(nameFn, (title) => getReporter().addStep(title))
}

export function testCaseId<T>(idFn: string | ((arg: T) => string)): TestDecorator {
  return processDecorator(idFn, (id) => getReporter().addTestId(id))
}

export function issue<T>(idFn: string | ((arg: T) => string)): TestDecorator {
  return processDecorator(idFn, (id) => getReporter().addIssue(id))
}

export function feature<T>(featureFn: string | ((arg: T) => string)): TestDecorator {
  return processDecorator(featureFn, (name) => getReporter().addFeature(name))
}

export function story<T>(storyFn: string | ((arg: T) => string)): TestDecorator {
  return processDecorator(storyFn, (name) => getReporter().addStory(name))
}

export function severity<T>(severityFn: Severity | string | ((arg: T) => string | Severity)): TestDecorator {
  return processDecorator(severityFn, (name) => getReporter().addSeverity(name))
}

function getReporter(): IAllureReporter {
  // @ts-ignore
  const reporter: IAllureReporter = global.reporter
  if (!reporter) {
    throw new Error('Unable to find AllureReporter in a global context')
  }
  return reporter
}

function processDescriptor<T>(
  parameterFn: string | ((arg: T) => string),
  reporterFn: (arg: string) => void,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original: object = descriptor.value
  if (typeof original === 'function') {
    descriptor.value = function (...args: [object]) {
      try {
        const value: string = typeof parameterFn === 'function' ? parameterFn.apply(this, args) : parameterFn
        reporterFn(value)
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(`[ERROR] Failed to apply decorator: ${e}`)
      }
      return original.apply(this, args)
    }
  }

  for (const prop of Object.keys(original)) {
    if (original.hasOwnProperty(prop) && prop.startsWith('__testdeck_')) {
      descriptor.value[prop] = original[prop]
    }
  }

  return descriptor
}

function makeParamsFunction<T>(execution?: Execution): ParamsDecorator {
  return (params: Params, name?: string) => {
    return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
      const adjustedParams = typeof params === 'function' ? params() : params
      target[propertyKey][testNameSymbol] = propertyKey.toString()
      target[propertyKey][parametersSymbol] = target[propertyKey][parametersSymbol] || []
      ;[].concat(adjustedParams || []).forEach((param) => {
        target[propertyKey][parametersSymbol].push({ execution, name, params: param })
      })
      return processDescriptor<T>(
        (args) => JSON.stringify(args),
        (arg) => getReporter().addArgument('inputs', arg),
        descriptor
      )
    }
  }
}

function makeParamsNameFunction(): ParamsDecorator {
  return (nameForParameters: (params: Params) => string) => {
    return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
      target[propertyKey][nameForParametersSymbol] = nameForParameters
      return descriptor
    }
  }
}

function makeParamsObject(): ParameterizedPropertyDescriptor {
  return Object.assign(makeParamsFunction(), {
    only: makeParamsFunction('only'),
    pending: makeParamsFunction('pending'),
    skip: makeParamsFunction('skip'),
    naming: makeParamsNameFunction(),
  })
}

function processDecorator<T>(parameterFn: string | ((arg: T) => string), reporterFn: (arg: string) => void): TestDecorator {
  return (target: object, property: string, descriptor: PropertyDescriptor) => {
    return processDescriptor(parameterFn, reporterFn, descriptor)
  }
}
