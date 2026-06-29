import * as React from 'react'

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 3000

type ToastVariant = 'default' | 'destructive' | 'success'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

type Action =
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'DISMISS_TOAST'; id: string }
  | { type: 'REMOVE_TOAST'; id: string }

interface State {
  toasts: Toast[]
}

const listeners: ((state: State) => void)[] = []
let state: State = { toasts: [] }

function dispatch(action: Action) {
  state = reducer(state, action)
  listeners.forEach((l) => l(state))
}

function reducer(s: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return { toasts: [action.toast, ...s.toasts].slice(0, TOAST_LIMIT) }
    case 'DISMISS_TOAST':
      return { toasts: s.toasts.map((t) => (t.id === action.id ? t : t)) }
    case 'REMOVE_TOAST':
      return { toasts: s.toasts.filter((t) => t.id !== action.id) }
  }
}

let count = 0
function genId() {
  return `toast-${++count}`
}

function toast(props: Omit<Toast, 'id'>) {
  const id = genId()
  dispatch({ type: 'ADD_TOAST', toast: { ...props, id } })
  setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), props.duration ?? TOAST_REMOVE_DELAY)
  return id
}

function useToast() {
  const [s, setS] = React.useState<State>(state)
  React.useEffect(() => {
    listeners.push(setS)
    return () => {
      const idx = listeners.indexOf(setS)
      if (idx > -1) listeners.splice(idx, 1)
    }
  }, [])
  return {
    toasts: s.toasts,
    toast,
    dismiss: (id: string) => dispatch({ type: 'REMOVE_TOAST', id }),
  }
}

export { useToast, toast }
