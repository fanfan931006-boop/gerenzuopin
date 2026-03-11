declare module 'react' {
  export interface ReactElement<
    P = any,
    T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>
  > {
    type: T;
    props: P;
    key: Key | null;
  }

  export interface ReactFragment {
    key?: Key;
    children?: ReactNode;
  }

  export interface ReactPortal {
    key: Key | null;
    children: ReactNode;
  }

  export type ReactText = string | number;
  export type ReactChild = ReactElement | ReactText;

  export interface ReactNodeArray extends Array<ReactNode> {}
  export type ReactFragment = {} | ReactNodeArray;
  export type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;

  export type Key = string | number;

  export interface Component<P = {}, S = {}, SS = any> {
    context: any;
    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => Pick<S, K> | S | null) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;
    forceUpdate(callback?: () => void): void;
    render(): ReactNode;
    readonly props: Readonly<P> & Readonly<{ children?: ReactNode }>;
    readonly state: Readonly<S>;
    readonly refs: { [key: string]: ReactInstance };
  }

  export interface ComponentClass<P = {}, S = {}, SS = any> extends Function {
    new (props: P, context?: any): Component<P, S, SS>;
    propTypes?: any;
    contextTypes?: any;
    childContextTypes?: any;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  export interface FunctionComponent<P = {}> {
    (props: P & { children?: ReactNode }, context?: any): ReactElement<any, any> | null;
    propTypes?: any;
    contextTypes?: any;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  export interface JSXElementConstructor<P> {
    new (props: P): Component<any, any>;
    (props: P): ReactElement<any, any>;
  }

  export function useState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>];
  export function useRef<T>(initialValue: T): { current: T };
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useContext<T>(Context: ReactContext<T>): T;

  export interface ReactContext<T> {
    Provider: ComponentType<{ value: T }>;
    Consumer: ComponentType<{ children: (value: T) => ReactNode }>;
    displayName?: string;
  }

  export function createContext<T>(defaultValue: T): ReactContext<T>;

  export type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

  export interface ReactInstance {
    [key: string]: any;
  }

  export type ReactSetStateAction<S> = S | ((prevState: S) => S);
  export type ReactDispatch<A> = (value: A) => void;

  export default React;
}

declare module 'react-dom' {
  export function createRoot(container: Element | DocumentFragment): {
    render: (element: React.ReactNode) => void;
    unmount: () => void;
  };

  export function hydrateRoot(container: Element | DocumentFragment, element: React.ReactNode): {
    render: (element: React.ReactNode) => void;
    unmount: () => void;
  };

  export default {
    createRoot,
    hydrateRoot
  };
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: string | number): any;
  export function jsxs(type: any, props: any, key?: string | number): any;
  export function jsxDEV(type: any, props: any, key?: string | number, isStaticChildren?: boolean, source?: any, self?: any): any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }

    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any, any, any> {}
    interface ElementAttributesProperty {
      props: any;
    }
    interface ElementChildrenAttribute {
      children: any;
    }
  }
}
