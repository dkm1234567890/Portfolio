import { createContext, useContext } from 'react'

// Lets any RiverNode rendered as a `children` of River read the same path
// element, cached length and breakpoint Ship uses — without App.jsx having to
// thread River's internal refs through by hand. Split into its own module
// (rather than living in River.jsx) so that file only exports the component,
// which is what react-refresh's fast-refresh rule requires.
export const RiverContext = createContext(null)

export function useRiverContext() {
  const ctx = useContext(RiverContext)
  if (!ctx) throw new Error('useRiverContext must be used inside <River>')
  return ctx
}
