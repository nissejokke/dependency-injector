/* eslint-disable max-classes-per-file */
import { DependencyInjector, asValue, asClass, asFunction } from './dependency-injector';

test('should register value', () => {
    const di = new DependencyInjector();
    di.register({
        db: asValue('localhost'),
    });
    const db = di.resolve('db');
    expect(db).toBe('localhost');
});

test('should register class', () => {
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
    expect(service.db).toBe('localhost');
});

test('should register classes depth 2', () => {
    const di = new DependencyInjector();
    di.register({
        db: asValue('localhost'),
        service: asClass(
            class Service {
                rest: unknown;

                constructor(rest: unknown) {
                    this.rest = rest;
                }
            }
        ),
        rest: asClass(
            class Rest {
                db: string;

                constructor(db: string) {
                    this.db = db;
                }
            }
        ),
    });
    const service = di.resolve('service') as { rest: { db: string } };
    expect(service.rest.db).toBe('localhost');
});

test('should register function', () => {
    const di = new DependencyInjector();
    di.register({
        id: asValue(1),
        service: asFunction((id: number) => id * 2),
    });
    const service = di.resolve('service') as number;
    expect(service).toBe(2);
});

test('should register arrow function', () => {
    const di = new DependencyInjector();
    di.register({
        val: asValue(1),
        val2: asValue(2),
        sum: asFunction((val: number, val2: number) => val + val2),
    });
    const sum = di.resolve('sum') as (val: number, val2: number) => number;
    expect(sum).toBe(3);
});

test('should handle multiple args', () => {
    const di = new DependencyInjector();
    di.register({
        id: asValue(1),
        id2: asFunction((id5: number, id: number) => id + 2),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id3: asFunction((id2: number, /* hej */ id4: number) => id2 + 3),
        id4: asValue(4),
        id5: asValue(5),
    });
    const id = di.resolve('id3') as (id2: number, id4: number) => number;
    expect(id).toBe(1 + 2 + 3);
});
