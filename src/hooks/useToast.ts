'use client';

import { ReactNode, useEffect, useState } from 'react';

import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

enum ActionType {
    // eslint-disable-next-line no-unused-vars
    ADD_TOAST = 'ADD_TOAST',
    // eslint-disable-next-line no-unused-vars
    UPDATE_TOAST = 'UPDATE_TOAST',
    // eslint-disable-next-line no-unused-vars
    DISMISS_TOAST = 'DISMISS_TOAST',
    // eslint-disable-next-line no-unused-vars
    REMOVE_TOAST = 'REMOVE_TOAST',
}

type ToasterToast = ToastProps & {
    id: string;
    title?: ReactNode;
    description?: ReactNode;
    action?: ToastActionElement;
};

interface State {
    toasts: ToasterToast[];
}

type Toast = Omit<ToasterToast, 'id'>;
type Action =
    | { type: ActionType.ADD_TOAST; toast: ToasterToast }
    | { type: ActionType.UPDATE_TOAST; toast: Partial<ToasterToast> }
    | { type: ActionType.DISMISS_TOAST | ActionType.REMOVE_TOAST; toastId?: ToasterToast['id'] };

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const listeners: Array<(state: State) => void> = [];
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

let count = 0;
let memoryState: State = { toasts: [] };

function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}

function dispatch(action: Action) {
    // eslint-disable-next-line no-use-before-define
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
}

function addToRemoveQueue(toastId: string) {
    if (toastTimeouts.has(toastId)) {
        return;
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({
            type: ActionType.REMOVE_TOAST,
            toastId,
        });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
}

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case ActionType.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
            };

        case ActionType.DISMISS_TOAST: {
            const { toastId } = action;

            // ! Side effects ! - This could be extracted into a dismissToast() action,
            // but I'll keep it here for simplicity
            if (toastId) {
                addToRemoveQueue(toastId);
            } else {
                state.toasts.forEach((t) => {
                    addToRemoveQueue(t.id);
                });
            }

            return {
                ...state,
                toasts: state.toasts.map((t) => {
                    if (t.id === toastId || !toastId) {
                        return {
                            ...t,
                            open: false,
                        };
                    }
                    return t;
                }),
            };
        }
        case ActionType.REMOVE_TOAST:
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            };
        default:
            return state;
    }
};

function toast({ ...props }: Toast) {
    const id = genId();

    const update = (updateProps: ToasterToast) =>
        dispatch({
            type: ActionType.UPDATE_TOAST,
            toast: { ...updateProps, id },
        });

    const dismiss = () => dispatch({ type: ActionType.DISMISS_TOAST, toastId: id });

    dispatch({
        type: ActionType.ADD_TOAST,
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
                if (!open) dismiss();
            },
        },
    });

    return {
        id,
        dismiss,
        update,
    };
}

function useToast() {
    const [state, setState] = useState<State>(memoryState);

    useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [state]);

    return {
        ...state,
        toast,
        dismiss: (toastId?: string) => dispatch({ type: ActionType.DISMISS_TOAST, toastId }),
    };
}

export { useToast, toast };
