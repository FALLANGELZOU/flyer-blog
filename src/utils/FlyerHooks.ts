import { useLatest } from "ahooks";
import { DependencyList, EffectCallback, ForwardedRef, Ref, useCallback, useEffect, useRef } from "react";

//  异步
export const useAsync = (asyncFn: any, onSuccess: Function) => {
    useEffect(() => {
      let isActive = true;
      asyncFn().then((res:any) => {
        if (isActive) onSuccess(res);
      });
      return () => { isActive = false };
    }, [asyncFn, onSuccess]);
  }


// 更新。
export function useUpdate(effect: EffectCallback, deps?: DependencyList) {
    const mountedRef = useRef(false);
    useEffect(() => {
        if (mountedRef.current) {
            return effect();
        } else {
            mountedRef.current = true;
        }
    }, deps);
}

// 卸载。
export function useUnmount(effect: () => void) {
    const effectRef = useRef(effect);
    effectRef.current = effect;

    useEffect(() => {
        return () => {
            effectRef.current();
        };
    }, []);
}

// 判断是否为浏览器环境。
export const inBrowser = !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);

// 持久化回调函数。通过 `usePersist` 包装后返回的回调函数，其地址不会变，但执行的函数还是最新的。
// 我不是很明白
export function usePersist<T extends (...args: any[]) => any>(callback: T): T {
    const persistRef = useRef<T>();
    const callbackRef = useRef(callback)
    callbackRef.current = callback

    if (persistRef.current === undefined) {
        persistRef.current = function (this: any, ...args) {
            return callbackRef.current.apply(this, args);
        } as T;
    }

    return persistRef.current;
}

// 合并 Ref。这个只能在ref中使用，因为返还的是个回调函数，不能直接用的
export function useMergedRef<T>(...refs: (ForwardedRef<T> | undefined)[]): Ref<T> {
    return (instance: T) => {
        //  系统调用，传入的是对应的dom结点
        refs.forEach((ref) => {
            //  把传入的ref传递给refs，这样所有的refs都对应同一个dom
            if (typeof ref === "function") {
                ref(instance);
            } else if (ref && "current" in ref) {
                ref.current = instance;
            }
        });
    };
}


export const useInterval =  (
    fn: () => void,
    delay: number | undefined,
    options: {
      immediate?: boolean;
    } = {},
  ) => {
    const { immediate } = options;
  
    const fnRef = useLatest(fn);
    const timerRef = useRef<NodeJS.Timer | null>(null);
  
    useEffect(() => {
      if (!isNumber(delay) || delay < 0) {
        return;
      }
      if (immediate) {
        fnRef.current();
      }
      timerRef.current = setInterval(() => {
        fnRef.current();
      }, delay);
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }, [delay]);
  
    const clear = useCallback(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }, []);
  
    return clear;
  }

export const isNumber = (value: unknown): value is number => typeof value === 'number';