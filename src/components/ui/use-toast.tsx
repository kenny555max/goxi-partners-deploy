import * as React from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToastActionElement = React.ReactNode

export type Toast = {
    id: string
    title?: React.ReactNode
    description?: React.ReactNode
    action?: ToastActionElement
    variant?: "default" | "destructive"
}

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER
    return count.toString()
}

type ActionType = typeof actionTypes

type Action =
    | {
    type: ActionType["ADD_TOAST"]
    toast: Toast
}
    | {
    type: ActionType["UPDATE_TOAST"]
    toast: Partial<Toast>
    id: string
}
    | {
    type: ActionType["DISMISS_TOAST"]
    id: string
}
    | {
    type: ActionType["REMOVE_TOAST"]
    id: string
}

interface State {
    toasts: Toast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            }

        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.id ? { ...t, ...action.toast } : t
                ),
            }

        case actionTypes.DISMISS_TOAST: {
            const { id } = action

            // Cancel any ongoing timeout
            if (toastTimeouts.has(id)) {
                clearTimeout(toastTimeouts.get(id))
                toastTimeouts.delete(id)
            }

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === id ? { ...t } : t
                ),
            }
        }

        case actionTypes.REMOVE_TOAST:
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.id),
            }

        default:
            return state
    }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => {
        listener(memoryState)
    })
}

interface ToastContextType {
    toasts: Toast[]
    toast: (props: Omit<Toast, "id">) => string
    dismiss: (toastId: string) => void
    update: (id: string, props: Partial<Toast>) => void
}

export const ToastContext = React.createContext<ToastContextType | null>(null)

export function useToast() {
    const [state, setState] = React.useState<State>(memoryState)

    React.useEffect(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [state])

    return {
        ...state,
        toast: (props: Omit<Toast, "id">) => {
            const id = genId()

            /*
            const update = (props: Partial<Toast>) =>
                dispatch({
                    type: actionTypes.UPDATE_TOAST,
                    id,
                    toast: props,
                })

            const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, id })

             */

            dispatch({
                type: actionTypes.ADD_TOAST,
                toast: {
                    ...props,
                    id,
                },
            })

            // Set timeout to auto-dismiss
            toastTimeouts.set(
                id,
                setTimeout(() => {
                    dispatch({ type: actionTypes.DISMISS_TOAST, id })

                    setTimeout(() => {
                        dispatch({ type: actionTypes.REMOVE_TOAST, id })
                    }, 300) // Animation duration
                }, TOAST_REMOVE_DELAY)
            )

            return id
        },
        dismiss: (toastId: string) => {
            dispatch({ type: actionTypes.DISMISS_TOAST, id: toastId })
        },
        update: (id: string, props: Partial<Toast>) => {
            dispatch({ type: actionTypes.UPDATE_TOAST, id, toast: props })
        },
    }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = React.useState<State>(memoryState)

    React.useEffect(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [state])

    return (
        <ToastContext.Provider
            value={{
                toasts: state.toasts,
                toast: (props) => {
                    const id = genId()

                    dispatch({
                        type: actionTypes.ADD_TOAST,
                        toast: {
                            ...props,
                            id,
                        },
                    })

                    toastTimeouts.set(
                        id,
                        setTimeout(() => {
                            dispatch({ type: actionTypes.DISMISS_TOAST, id })

                            setTimeout(() => {
                                dispatch({ type: actionTypes.REMOVE_TOAST, id })
                            }, 300) // Animation duration for removal
                        }, TOAST_REMOVE_DELAY)
                    )

                    return id
                },
                dismiss: (toastId) => {
                    dispatch({ type: actionTypes.DISMISS_TOAST, id: toastId })
                },
                update: (id, props) => {
                    dispatch({ type: actionTypes.UPDATE_TOAST, id, toast: props })
                },
            }}
        >
            {children}
        </ToastContext.Provider>
    )
}

export const useToastMessage = () => {
    const context = React.useContext(ToastContext)

    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }

    return context
}