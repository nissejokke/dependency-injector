# Dependency injector

Simple dependency injector for javascript/typescript which works in IE and doesn't use [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

Inspired by [Awilix](https://github.com/jeffijoe/awilix).

## Examples

```javascript
const di = new DependencyInjector();
di.register({
    db: asValue('localhost'),
});
const db = di.resolve('db'); 
// db == localhost
```

```typescript
const di = new DependencyInjector();
di.register({
    db: asValue('localhost'),
    service: asClass(
        class Service {
            db: string;

            constructor(db: string) {
                this.db = db;
            }
        }
    ),
});
const service = di.resolve('service') as { db: string };
// service.db == localhost
```

```typescript
const di = new DependencyInjector();
di.register({
    id: asValue(1),
    service: asFunction((id: number) => id * 2),
});
const service = di.resolve('service') as number;
// service == 2
```

Dependencies will be instanciated every time they are resolved. See test for more examples.

## Restrictions

- Class and function names can't be mangled, they must be preserved

## API 

### DependencyInjector

## register()

Registers dependencies as values (asValue), function (asFunction) or classes (asClass) 

## resolve()

Resolves dependency

### resolveDependency()

Resolves dependency but returns DepencencyType result

## createScope()

Creates new DepencencyInjector instance from current instance

## deps

Dependecies dictionary