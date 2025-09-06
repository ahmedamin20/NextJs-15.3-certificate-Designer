'use client';
import { useEffect, useState } from "react";

class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  subscribe(eventName: string, fn: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
    return () => {
      this.events[eventName] = this.events[eventName].filter(
        (eventFn) => fn !== eventFn
      );
    };
  }
  

  emit(eventName?: string, data?: any) {
    const event = this.events[eventName || "changeLoading"];
    if (event) {
      event.forEach((fn) => {
        fn.call(null, data);
      });
    }
  }
}
export const eventEmitter = new EventEmitter();

export function GlobalLoading() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const unsubscribe = eventEmitter.subscribe("changeLoading", setLoading);
    return () => unsubscribe();
  }, []);
  return loading;
}
