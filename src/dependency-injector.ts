/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DependencyType {
    type: 'class' | 'function' | 'value';
    value: unknown;
}

export function asClass(fn: unknown): DependencyType {
    return {
        type: 'class',
        value: fn,
    };
}

export function asFunction(fn: unknown): DependencyType {
    return {
        type: 'function',
        value: fn,
    };
}

export function asValue(val: unknown): DependencyType {
    return {
        type: 'value',
        value: val,
    };
}

export class DependencyInjector {
    deps: Record<string, DependencyType>;

    private readonly STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;

    private readonly ARGUMENT_NAMES = /([^\s,]+)/g;

    constructor(injector?: DependencyInjector) {
        if (injector) this.deps = { ...injector.deps };
        else this.deps = {};
    }

    /**
     * Register dependencies
     * @param deps dependencies
     */
    register(deps: Record<string, DependencyType>): DependencyInjector {
        Object.keys(deps).forEach(key => {
            this.deps[key] = deps[key];
        });
        return this;
    }

    /**
     * Return instance type
     * @param name name of dependency
     */
    resolveDependency(name: string, path: string[] = []): DependencyType {
        path.push(name);
        if (!(name in this.deps))
            throw new Error(`"${name}" is not in dependencies, path: ${path.join(', ')}.`);
        const dependency = this.deps[name];

        const { type } = dependency;
        if (type === 'class') {
            const fnNames = this.getParamNames(dependency.value);
            const dependencyValues = fnNames.map(fnName => this.resolveDependency(fnName).value, [
                ...path,
            ]);
            const DepClass = dependency.value as any;
            const instance = new DepClass(...dependencyValues);
            return asValue(instance);
        }
        if (type === 'function') {
            const fnNames = this.getParamNames(dependency.value);
            const dependencyValues = fnNames.map(fnName => this.resolveDependency(fnName).value, [
                ...path,
            ]);
            return asValue(
                (dependency.value as (...args: any[]) => any).apply(this, dependencyValues)
            );
        }
        return this.deps[name];
    }

    /**
     * Return instance value by name
     * @param name name of dependency
     */
    resolve(name: string): unknown {
        const dep = this.resolveDependency(name);
        return dep.value;
    }

    createScope(): DependencyInjector {
        return new DependencyInjector(this);
    }

    /**
     * Get parameter names of function or class instance
     * @param functionOrClassInstance function or class instance
     * @link source: https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically?page=1&tab=votes#tab-top
     */
    private getParamNames(functionOrClassInstance: any): string[] {
        const fnStr = functionOrClassInstance.toString().replace(this.STRIP_COMMENTS, '');
        let result: string[] = fnStr
            .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
            .match(this.ARGUMENT_NAMES);

        if (result === null) return [];
        result = result.map(name => name.replace(/[{}]/g, '')).filter(name => Boolean(name));
        const invalid = result.find(val => val.startsWith('...'));
        if (invalid)
            throw new Error(
                `Dependency-injector error: ${invalid} in not allowed in as dependency. (Hint: Did you forget constructor in class?)`
            );
        return result;
    }
}
