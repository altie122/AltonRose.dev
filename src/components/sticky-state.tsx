// source: https://www.joshwcomeau.com/snippets/react-hooks/use-sticky-state/
// types and heavy modifications added by: Gemini 2.5 Flash on https://t3.chat

// sticky-state.ts
import React from "react";

// Define the type for our context value
// It's a tuple: [value, setValue function]
type StickyStateContextType<T> = [T, React.Dispatch<React.SetStateAction<T>>];

// We'll create a generic context. Initialize with undefined
// It will be properly typed in the Provider.
const StickyStateContext = React.createContext<StickyStateContextType<any> | undefined>(
  undefined
);

// A map to hold unique contexts for each key
// This allows you to have multiple independent sticky states if needed
const keyContextMap = new Map<string, typeof StickyStateContext>();

// Custom hook to create or retrieve the context for a specific key
function getOrCreateStickyStateContext(key: string) {
  if (!keyContextMap.has(key)) {
    // If the context for this key doesn't exist, create it
    const newContext = React.createContext<
      StickyStateContextType<any> | undefined
    >(undefined);
    keyContextMap.set(key, newContext);
  }
  return keyContextMap.get(key)!; // We know it exists now
}

export function useStickyState<T>(
  defaultValue: T,
  key: string
): StickyStateContextType<T> {
  // Get the specific context for this key
  const Context = getOrCreateStickyStateContext(key);

  // Try to consume the context
  const context = React.useContext(Context);

  if (context === undefined) {
    // If we're not inside a StickyStateProvider for this key,
    // we need to manage the state internally and persist it.
    // This is the fallback for when no Provider is wrapping the component,
    // or for the initial state managed by the Provider itself.
    const [value, setValue] = React.useState<T>(() => {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? (JSON.parse(stickyValue) as T) : defaultValue;
    });

    React.useEffect(() => {
      window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
  }

  // If we are inside a provider, use the context's value
  return context as StickyStateContextType<T>;
}


// The Provider component that will wrap your application (or parts of it)
interface StickyStateProviderProps<T> {
  keyName: string; // The key for localStorage
  defaultValue: T; // The default value
  children: React.ReactNode;
}

export function StickyStateProvider<T>({
  keyName,
  defaultValue,
  children,
}: StickyStateProviderProps<T>) {
  // Get the specific context for this key
  const Context = getOrCreateStickyStateContext(keyName);

  // Manage the state here centrally
  const [value, setValue] = React.useState<T>(() => {
    const stickyValue = window.localStorage.getItem(keyName);
    return stickyValue !== null ? (JSON.parse(stickyValue) as T) : defaultValue;
  });

  // Persist to localStorage whenever value changes
  React.useEffect(() => {
    window.localStorage.setItem(keyName, JSON.stringify(value));
  }, [keyName, value]);

  // Provide the value and setter through the context
  return (
    <Context.Provider value={[value, setValue]}>
      {children}
    </Context.Provider>
  );
}