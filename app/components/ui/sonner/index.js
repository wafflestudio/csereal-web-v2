// Sonner의 CSP 이슈로 소스코드 직접 사용
// https://github.com/emilkowalski/sonner/issues/449

/** biome-ignore-all lint/suspicious/noAssignInExpressions: sonner source code */
/** biome-ignore-all lint/suspicious/noDoubleEquals: sonner source code */
/** biome-ignore-all lint/a11y/useButtonType: sonner source code */
/** biome-ignore-all lint/correctness/noInnerDeclarations: sonner source code */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: sonner source code */
'use client';

import React from 'react';
import ReactDOM from 'react-dom';

const getAsset = (type) => {
  switch (type) {
    case 'success':
      return SuccessIcon;
    case 'info':
      return InfoIcon;
    case 'warning':
      return WarningIcon;
    case 'error':
      return ErrorIcon;
    default:
      return null;
  }
};
const bars = Array(12).fill(0);
const Loader = ({ visible, className }) => {
  return /*#__PURE__*/ React.createElement(
    'div',
    {
      className: ['sonner-loading-wrapper', className]
        .filter(Boolean)
        .join(' '),
      'data-visible': visible,
    },
    /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'sonner-spinner',
      },
      bars.map((_, i) =>
        /*#__PURE__*/ React.createElement('div', {
          className: 'sonner-loading-bar',
          key: `spinner-bar-${i}`,
        }),
      ),
    ),
  );
};
const SuccessIcon = /*#__PURE__*/ React.createElement(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 20 20',
    fill: 'currentColor',
    height: '20',
    width: '20',
  },
  /*#__PURE__*/ React.createElement('path', {
    fillRule: 'evenodd',
    d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z',
    clipRule: 'evenodd',
  }),
);
const WarningIcon = /*#__PURE__*/ React.createElement(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    height: '20',
    width: '20',
  },
  /*#__PURE__*/ React.createElement('path', {
    fillRule: 'evenodd',
    d: 'M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z',
    clipRule: 'evenodd',
  }),
);
const InfoIcon = /*#__PURE__*/ React.createElement(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 20 20',
    fill: 'currentColor',
    height: '20',
    width: '20',
  },
  /*#__PURE__*/ React.createElement('path', {
    fillRule: 'evenodd',
    d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z',
    clipRule: 'evenodd',
  }),
);
const ErrorIcon = /*#__PURE__*/ React.createElement(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 20 20',
    fill: 'currentColor',
    height: '20',
    width: '20',
  },
  /*#__PURE__*/ React.createElement('path', {
    fillRule: 'evenodd',
    d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z',
    clipRule: 'evenodd',
  }),
);
const CloseIcon = /*#__PURE__*/ React.createElement(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '12',
    height: '12',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  /*#__PURE__*/ React.createElement('line', {
    x1: '18',
    y1: '6',
    x2: '6',
    y2: '18',
  }),
  /*#__PURE__*/ React.createElement('line', {
    x1: '6',
    y1: '6',
    x2: '18',
    y2: '18',
  }),
);

const useIsDocumentHidden = () => {
  const [isDocumentHidden, setIsDocumentHidden] = React.useState(
    document.hidden,
  );
  React.useEffect(() => {
    const callback = () => {
      setIsDocumentHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', callback);
    return () => window.removeEventListener('visibilitychange', callback);
  }, []);
  return isDocumentHidden;
};

let toastsCounter = 1;
class Observer {
  constructor() {
    // We use arrow functions to maintain the correct `this` reference
    this.subscribe = (subscriber) => {
      this.subscribers.push(subscriber);
      return () => {
        const index = this.subscribers.indexOf(subscriber);
        this.subscribers.splice(index, 1);
      };
    };
    this.publish = (data) => {
      this.subscribers.forEach((subscriber) => subscriber(data));
    };
    this.addToast = (data) => {
      this.publish(data);
      this.toasts = [...this.toasts, data];
    };
    this.create = (data) => {
      var _data_id;
      const { message, ...rest } = data;
      const id =
        typeof (data == null ? void 0 : data.id) === 'number' ||
        ((_data_id = data.id) == null ? void 0 : _data_id.length) > 0
          ? data.id
          : toastsCounter++;
      const alreadyExists = this.toasts.find((toast) => {
        return toast.id === id;
      });
      const dismissible =
        data.dismissible === undefined ? true : data.dismissible;
      if (this.dismissedToasts.has(id)) {
        this.dismissedToasts.delete(id);
      }
      if (alreadyExists) {
        this.toasts = this.toasts.map((toast) => {
          if (toast.id === id) {
            this.publish({
              ...toast,
              ...data,
              id,
              title: message,
            });
            return {
              ...toast,
              ...data,
              id,
              dismissible,
              title: message,
            };
          }
          return toast;
        });
      } else {
        this.addToast({
          title: message,
          ...rest,
          dismissible,
          id,
        });
      }
      return id;
    };
    this.dismiss = (id) => {
      if (id) {
        this.dismissedToasts.add(id);
        requestAnimationFrame(() =>
          this.subscribers.forEach((subscriber) =>
            subscriber({
              id,
              dismiss: true,
            }),
          ),
        );
      } else {
        this.toasts.forEach((toast) => {
          this.subscribers.forEach((subscriber) =>
            subscriber({
              id: toast.id,
              dismiss: true,
            }),
          );
        });
      }
      return id;
    };
    this.message = (message, data) => {
      return this.create({
        ...data,
        message,
      });
    };
    this.error = (message, data) => {
      return this.create({
        ...data,
        message,
        type: 'error',
      });
    };
    this.success = (message, data) => {
      return this.create({
        ...data,
        type: 'success',
        message,
      });
    };
    this.info = (message, data) => {
      return this.create({
        ...data,
        type: 'info',
        message,
      });
    };
    this.warning = (message, data) => {
      return this.create({
        ...data,
        type: 'warning',
        message,
      });
    };
    this.loading = (message, data) => {
      return this.create({
        ...data,
        type: 'loading',
        message,
      });
    };
    this.promise = (promise, data) => {
      if (!data) {
        // Nothing to show
        return;
      }
      let id;
      if (data.loading !== undefined) {
        id = this.create({
          ...data,
          promise,
          type: 'loading',
          message: data.loading,
          description:
            typeof data.description !== 'function'
              ? data.description
              : undefined,
        });
      }
      const p = Promise.resolve(
        promise instanceof Function ? promise() : promise,
      );
      let shouldDismiss = id !== undefined;
      let result;
      const originalPromise = p
        .then(async (response) => {
          result = ['resolve', response];
          const isReactElementResponse = React.isValidElement(response);
          if (isReactElementResponse) {
            shouldDismiss = false;
            this.create({
              id,
              type: 'default',
              message: response,
            });
          } else if (isHttpResponse(response) && !response.ok) {
            shouldDismiss = false;
            const promiseData =
              typeof data.error === 'function'
                ? await data.error(`HTTP error! status: ${response.status}`)
                : data.error;
            const description =
              typeof data.description === 'function'
                ? await data.description(
                    `HTTP error! status: ${response.status}`,
                  )
                : data.description;
            const isExtendedResult =
              typeof promiseData === 'object' &&
              !React.isValidElement(promiseData);
            const toastSettings = isExtendedResult
              ? promiseData
              : {
                  message: promiseData,
                };
            this.create({
              id,
              type: 'error',
              description,
              ...toastSettings,
            });
          } else if (response instanceof Error) {
            shouldDismiss = false;
            const promiseData =
              typeof data.error === 'function'
                ? await data.error(response)
                : data.error;
            const description =
              typeof data.description === 'function'
                ? await data.description(response)
                : data.description;
            const isExtendedResult =
              typeof promiseData === 'object' &&
              !React.isValidElement(promiseData);
            const toastSettings = isExtendedResult
              ? promiseData
              : {
                  message: promiseData,
                };
            this.create({
              id,
              type: 'error',
              description,
              ...toastSettings,
            });
          } else if (data.success !== undefined) {
            shouldDismiss = false;
            const promiseData =
              typeof data.success === 'function'
                ? await data.success(response)
                : data.success;
            const description =
              typeof data.description === 'function'
                ? await data.description(response)
                : data.description;
            const isExtendedResult =
              typeof promiseData === 'object' &&
              !React.isValidElement(promiseData);
            const toastSettings = isExtendedResult
              ? promiseData
              : {
                  message: promiseData,
                };
            this.create({
              id,
              type: 'success',
              description,
              ...toastSettings,
            });
          }
        })
        .catch(async (error) => {
          result = ['reject', error];
          if (data.error !== undefined) {
            shouldDismiss = false;
            const promiseData =
              typeof data.error === 'function'
                ? await data.error(error)
                : data.error;
            const description =
              typeof data.description === 'function'
                ? await data.description(error)
                : data.description;
            const isExtendedResult =
              typeof promiseData === 'object' &&
              !React.isValidElement(promiseData);
            const toastSettings = isExtendedResult
              ? promiseData
              : {
                  message: promiseData,
                };
            this.create({
              id,
              type: 'error',
              description,
              ...toastSettings,
            });
          }
        })
        .finally(() => {
          if (shouldDismiss) {
            // Toast is still in load state (and will be indefinitely — dismiss it)
            this.dismiss(id);
            id = undefined;
          }
          data.finally == null ? void 0 : data.finally.call(data);
        });
      const unwrap = () =>
        new Promise((resolve, reject) =>
          originalPromise
            .then(() =>
              result[0] === 'reject' ? reject(result[1]) : resolve(result[1]),
            )
            .catch(reject),
        );
      if (typeof id !== 'string' && typeof id !== 'number') {
        // cannot Object.assign on undefined
        return {
          unwrap,
        };
      } else {
        return Object.assign(id, {
          unwrap,
        });
      }
    };
    this.custom = (jsx, data) => {
      const id = (data == null ? void 0 : data.id) || toastsCounter++;
      this.create({
        jsx: jsx(id),
        id,
        ...data,
      });
      return id;
    };
    this.getActiveToasts = () => {
      return this.toasts.filter((toast) => !this.dismissedToasts.has(toast.id));
    };
    this.subscribers = [];
    this.toasts = [];
    this.dismissedToasts = new Set();
  }
}
const ToastState = new Observer();
// bind this to the toast function
const toastFunction = (message, data) => {
  const id = (data == null ? void 0 : data.id) || toastsCounter++;
  ToastState.addToast({
    title: message,
    ...data,
    id,
  });
  return id;
};
const isHttpResponse = (data) => {
  return (
    data &&
    typeof data === 'object' &&
    'ok' in data &&
    typeof data.ok === 'boolean' &&
    'status' in data &&
    typeof data.status === 'number'
  );
};
const basicToast = toastFunction;
const getHistory = () => ToastState.toasts;
const getToasts = () => ToastState.getActiveToasts();
// We use `Object.assign` to maintain the correct types as we would lose them otherwise
const toast = Object.assign(
  basicToast,
  {
    success: ToastState.success,
    info: ToastState.info,
    warning: ToastState.warning,
    error: ToastState.error,
    custom: ToastState.custom,
    message: ToastState.message,
    promise: ToastState.promise,
    dismiss: ToastState.dismiss,
    loading: ToastState.loading,
  },
  {
    getHistory,
    getToasts,
  },
);

function isAction(action) {
  return action.label !== undefined;
}

// Visible toasts amount
const VISIBLE_TOASTS_AMOUNT = 3;
// Viewport padding
const VIEWPORT_OFFSET = '24px';
// Mobile viewport padding
const MOBILE_VIEWPORT_OFFSET = '16px';
// Default lifetime of a toasts (in ms)
const TOAST_LIFETIME = 4000;
// Default toast width
const TOAST_WIDTH = 356;
// Default gap between toasts
const GAP = 14;
// Threshold to dismiss a toast
const SWIPE_THRESHOLD = 45;
// Equal to exit animation duration
const TIME_BEFORE_UNMOUNT = 200;
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
function getDefaultSwipeDirections(position) {
  const [y, x] = position.split('-');
  const directions = [];
  if (y) {
    directions.push(y);
  }
  if (x) {
    directions.push(x);
  }
  return directions;
}
const Toast = (props) => {
  var _toast_classNames,
    _toast_classNames1,
    _toast_classNames2,
    _toast_classNames3,
    _toast_classNames4,
    _toast_classNames5,
    _toast_classNames6,
    _toast_classNames7,
    _toast_classNames8;
  const {
    invert: ToasterInvert,
    toast,
    unstyled,
    interacting,
    setHeights,
    visibleToasts,
    heights,
    index,
    toasts,
    expanded,
    removeToast,
    defaultRichColors,
    closeButton: closeButtonFromToaster,
    style,
    cancelButtonStyle,
    actionButtonStyle,
    className = '',
    descriptionClassName = '',
    duration: durationFromToaster,
    position,
    gap,
    expandByDefault,
    classNames,
    icons,
    closeButtonAriaLabel = 'Close toast',
  } = props;
  const [swipeDirection, setSwipeDirection] = React.useState(null);
  const [swipeOutDirection, setSwipeOutDirection] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  const [removed, setRemoved] = React.useState(false);
  const [swiping, setSwiping] = React.useState(false);
  const [swipeOut, setSwipeOut] = React.useState(false);
  const [isSwiped, setIsSwiped] = React.useState(false);
  const [offsetBeforeRemove, setOffsetBeforeRemove] = React.useState(0);
  const [initialHeight, setInitialHeight] = React.useState(0);
  const remainingTime = React.useRef(
    toast.duration || durationFromToaster || TOAST_LIFETIME,
  );
  const dragStartTime = React.useRef(null);
  const toastRef = React.useRef(null);
  const isFront = index === 0;
  const isVisible = index + 1 <= visibleToasts;
  const toastType = toast.type;
  const dismissible = toast.dismissible !== false;
  const toastClassname = toast.className || '';
  const toastDescriptionClassname = toast.descriptionClassName || '';
  // Height index is used to calculate the offset as it gets updated before the toast array, which means we can calculate the new layout faster.
  const heightIndex = React.useMemo(
    () => heights.findIndex((height) => height.toastId === toast.id) || 0,
    [heights, toast.id],
  );
  const closeButton = React.useMemo(() => {
    var _toast_closeButton;
    return (_toast_closeButton = toast.closeButton) != null
      ? _toast_closeButton
      : closeButtonFromToaster;
  }, [toast.closeButton, closeButtonFromToaster]);
  const duration = React.useMemo(
    () => toast.duration || durationFromToaster || TOAST_LIFETIME,
    [toast.duration, durationFromToaster],
  );
  const closeTimerStartTimeRef = React.useRef(0);
  const offset = React.useRef(0);
  const lastCloseTimerStartTimeRef = React.useRef(0);
  const pointerStartRef = React.useRef(null);
  const [y, x] = position.split('-');
  const toastsHeightBefore = React.useMemo(() => {
    return heights.reduce((prev, curr, reducerIndex) => {
      // Calculate offset up until current toast
      if (reducerIndex >= heightIndex) {
        return prev;
      }
      return prev + curr.height;
    }, 0);
  }, [heights, heightIndex]);
  const isDocumentHidden = useIsDocumentHidden();
  const invert = toast.invert || ToasterInvert;
  const disabled = toastType === 'loading';
  offset.current = React.useMemo(
    () => heightIndex * gap + toastsHeightBefore,
    [heightIndex, toastsHeightBefore],
  );
  React.useEffect(() => {
    remainingTime.current = duration;
  }, [duration]);
  React.useEffect(() => {
    // Trigger enter animation without using CSS animation
    setMounted(true);
  }, []);
  React.useEffect(() => {
    const toastNode = toastRef.current;
    if (toastNode) {
      const height = toastNode.getBoundingClientRect().height;
      // Add toast height to heights array after the toast is mounted
      setInitialHeight(height);
      setHeights((h) => [
        {
          toastId: toast.id,
          height,
          position: toast.position,
        },
        ...h,
      ]);
      return () =>
        setHeights((h) => h.filter((height) => height.toastId !== toast.id));
    }
  }, [setHeights, toast.id]);
  React.useLayoutEffect(() => {
    // Keep height up to date with the content in case it updates
    if (!mounted) return;
    const toastNode = toastRef.current;
    const originalHeight = toastNode.style.height;
    toastNode.style.height = 'auto';
    const newHeight = toastNode.getBoundingClientRect().height;
    toastNode.style.height = originalHeight;
    setInitialHeight(newHeight);
    setHeights((heights) => {
      const alreadyExists = heights.find(
        (height) => height.toastId === toast.id,
      );
      if (!alreadyExists) {
        return [
          {
            toastId: toast.id,
            height: newHeight,
            position: toast.position,
          },
          ...heights,
        ];
      } else {
        return heights.map((height) =>
          height.toastId === toast.id
            ? {
                ...height,
                height: newHeight,
              }
            : height,
        );
      }
    });
  }, [
    mounted,
    toast.title,
    toast.description,
    setHeights,
    toast.id,
    toast.jsx,
    toast.action,
    toast.cancel,
  ]);
  const deleteToast = React.useCallback(() => {
    // Save the offset for the exit swipe animation
    setRemoved(true);
    setOffsetBeforeRemove(offset.current);
    setHeights((h) => h.filter((height) => height.toastId !== toast.id));
    setTimeout(() => {
      removeToast(toast);
    }, TIME_BEFORE_UNMOUNT);
  }, [toast, removeToast, setHeights, offset]);
  React.useEffect(() => {
    if (
      (toast.promise && toastType === 'loading') ||
      toast.duration === Infinity ||
      toast.type === 'loading'
    )
      return;
    let timeoutId;
    // Pause the timer on each hover
    const pauseTimer = () => {
      if (lastCloseTimerStartTimeRef.current < closeTimerStartTimeRef.current) {
        // Get the elapsed time since the timer started
        const elapsedTime = Date.now() - closeTimerStartTimeRef.current;
        remainingTime.current = remainingTime.current - elapsedTime;
      }
      lastCloseTimerStartTimeRef.current = Date.now();
    };
    const startTimer = () => {
      // setTimeout(, Infinity) behaves as if the delay is 0.
      // As a result, the toast would be closed immediately, giving the appearance that it was never rendered.
      // See: https://github.com/denysdovhan/wtfjs?tab=readme-ov-file#an-infinite-timeout
      if (remainingTime.current === Infinity) return;
      closeTimerStartTimeRef.current = Date.now();
      // Let the toast know it has started
      timeoutId = setTimeout(() => {
        toast.onAutoClose == null
          ? void 0
          : toast.onAutoClose.call(toast, toast);
        deleteToast();
      }, remainingTime.current);
    };
    if (expanded || interacting || isDocumentHidden) {
      pauseTimer();
    } else {
      startTimer();
    }
    return () => clearTimeout(timeoutId);
  }, [expanded, interacting, toast, toastType, isDocumentHidden, deleteToast]);
  React.useEffect(() => {
    if (toast.delete) {
      deleteToast();
      toast.onDismiss == null ? void 0 : toast.onDismiss.call(toast, toast);
    }
  }, [deleteToast, toast.delete]);
  function getLoadingIcon() {
    var _toast_classNames;
    if (icons == null ? void 0 : icons.loading) {
      var _toast_classNames1;
      return /*#__PURE__*/ React.createElement(
        'div',
        {
          className: cn(
            classNames == null ? void 0 : classNames.loader,
            toast == null
              ? void 0
              : (_toast_classNames1 = toast.classNames) == null
                ? void 0
                : _toast_classNames1.loader,
            'sonner-loader',
          ),
          'data-visible': toastType === 'loading',
        },
        icons.loading,
      );
    }
    return /*#__PURE__*/ React.createElement(Loader, {
      className: cn(
        classNames == null ? void 0 : classNames.loader,
        toast == null
          ? void 0
          : (_toast_classNames = toast.classNames) == null
            ? void 0
            : _toast_classNames.loader,
      ),
      visible: toastType === 'loading',
    });
  }
  const icon =
    toast.icon ||
    (icons == null ? void 0 : icons[toastType]) ||
    getAsset(toastType);
  var _toast_richColors, _icons_close;
  return /*#__PURE__*/ React.createElement(
    'li',
    {
      tabIndex: 0,
      ref: toastRef,
      className: cn(
        className,
        toastClassname,
        classNames == null ? void 0 : classNames.toast,
        toast == null
          ? void 0
          : (_toast_classNames = toast.classNames) == null
            ? void 0
            : _toast_classNames.toast,
        classNames == null ? void 0 : classNames.default,
        classNames == null ? void 0 : classNames[toastType],
        toast == null
          ? void 0
          : (_toast_classNames1 = toast.classNames) == null
            ? void 0
            : _toast_classNames1[toastType],
      ),
      'data-sonner-toast': '',
      'data-rich-colors':
        (_toast_richColors = toast.richColors) != null
          ? _toast_richColors
          : defaultRichColors,
      'data-styled': !(toast.jsx || toast.unstyled || unstyled),
      'data-mounted': mounted,
      'data-promise': Boolean(toast.promise),
      'data-swiped': isSwiped,
      'data-removed': removed,
      'data-visible': isVisible,
      'data-y-position': y,
      'data-x-position': x,
      'data-index': index,
      'data-front': isFront,
      'data-swiping': swiping,
      'data-dismissible': dismissible,
      'data-type': toastType,
      'data-invert': invert,
      'data-swipe-out': swipeOut,
      'data-swipe-direction': swipeOutDirection,
      'data-expanded': Boolean(expanded || (expandByDefault && mounted)),
      'data-testid': toast.testId,
      style: {
        '--index': index,
        '--toasts-before': index,
        '--z-index': toasts.length - index,
        '--offset': `${removed ? offsetBeforeRemove : offset.current}px`,
        '--initial-height': expandByDefault ? 'auto' : `${initialHeight}px`,
        ...style,
        ...toast.style,
      },
      onDragEnd: () => {
        setSwiping(false);
        setSwipeDirection(null);
        pointerStartRef.current = null;
      },
      onPointerDown: (event) => {
        if (event.button === 2) return; // Return early on right click
        if (disabled || !dismissible) return;
        dragStartTime.current = new Date();
        setOffsetBeforeRemove(offset.current);
        // Ensure we maintain correct pointer capture even when going outside of the toast (e.g. when swiping)
        event.target.setPointerCapture(event.pointerId);
        if (event.target.tagName === 'BUTTON') return;
        setSwiping(true);
        pointerStartRef.current = {
          x: event.clientX,
          y: event.clientY,
        };
      },
      onPointerUp: () => {
        var _toastRef_current, _toastRef_current1, _dragStartTime_current;
        if (swipeOut || !dismissible) return;
        pointerStartRef.current = null;
        const swipeAmountX = Number(
          ((_toastRef_current = toastRef.current) == null
            ? void 0
            : _toastRef_current.style
                .getPropertyValue('--swipe-amount-x')
                .replace('px', '')) || 0,
        );
        const swipeAmountY = Number(
          ((_toastRef_current1 = toastRef.current) == null
            ? void 0
            : _toastRef_current1.style
                .getPropertyValue('--swipe-amount-y')
                .replace('px', '')) || 0,
        );
        const timeTaken =
          Date.now() -
          ((_dragStartTime_current = dragStartTime.current) == null
            ? void 0
            : _dragStartTime_current.getTime());
        const swipeAmount =
          swipeDirection === 'x' ? swipeAmountX : swipeAmountY;
        const velocity = Math.abs(swipeAmount) / timeTaken;
        if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
          setOffsetBeforeRemove(offset.current);
          toast.onDismiss == null ? void 0 : toast.onDismiss.call(toast, toast);
          if (swipeDirection === 'x') {
            setSwipeOutDirection(swipeAmountX > 0 ? 'right' : 'left');
          } else {
            setSwipeOutDirection(swipeAmountY > 0 ? 'down' : 'up');
          }
          deleteToast();
          setSwipeOut(true);
          return;
        } else {
          var _toastRef_current2, _toastRef_current3;
          (_toastRef_current2 = toastRef.current) == null
            ? void 0
            : _toastRef_current2.style.setProperty('--swipe-amount-x', `0px`);
          (_toastRef_current3 = toastRef.current) == null
            ? void 0
            : _toastRef_current3.style.setProperty('--swipe-amount-y', `0px`);
        }
        setIsSwiped(false);
        setSwiping(false);
        setSwipeDirection(null);
      },
      onPointerMove: (event) => {
        var _window_getSelection, // Apply transform using both x and y values
          _toastRef_current,
          _toastRef_current1;
        if (!pointerStartRef.current || !dismissible) return;
        const isHighlighted =
          ((_window_getSelection = window.getSelection()) == null
            ? void 0
            : _window_getSelection.toString().length) > 0;
        if (isHighlighted) return;
        const yDelta = event.clientY - pointerStartRef.current.y;
        const xDelta = event.clientX - pointerStartRef.current.x;
        var _props_swipeDirections;
        const swipeDirections =
          (_props_swipeDirections = props.swipeDirections) != null
            ? _props_swipeDirections
            : getDefaultSwipeDirections(position);
        // Determine swipe direction if not already locked
        if (!swipeDirection && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
          setSwipeDirection(Math.abs(xDelta) > Math.abs(yDelta) ? 'x' : 'y');
        }
        const swipeAmount = {
          x: 0,
          y: 0,
        };
        const getDampening = (delta) => {
          const factor = Math.abs(delta) / 20;
          return 1 / (1.5 + factor);
        };
        // Only apply swipe in the locked direction
        if (swipeDirection === 'y') {
          // Handle vertical swipes
          if (
            swipeDirections.includes('top') ||
            swipeDirections.includes('bottom')
          ) {
            if (
              (swipeDirections.includes('top') && yDelta < 0) ||
              (swipeDirections.includes('bottom') && yDelta > 0)
            ) {
              swipeAmount.y = yDelta;
            } else {
              // Smoothly transition to dampened movement
              const dampenedDelta = yDelta * getDampening(yDelta);
              // Ensure we don't jump when transitioning to dampened movement
              swipeAmount.y =
                Math.abs(dampenedDelta) < Math.abs(yDelta)
                  ? dampenedDelta
                  : yDelta;
            }
          }
        } else if (swipeDirection === 'x') {
          // Handle horizontal swipes
          if (
            swipeDirections.includes('left') ||
            swipeDirections.includes('right')
          ) {
            if (
              (swipeDirections.includes('left') && xDelta < 0) ||
              (swipeDirections.includes('right') && xDelta > 0)
            ) {
              swipeAmount.x = xDelta;
            } else {
              // Smoothly transition to dampened movement
              const dampenedDelta = xDelta * getDampening(xDelta);
              // Ensure we don't jump when transitioning to dampened movement
              swipeAmount.x =
                Math.abs(dampenedDelta) < Math.abs(xDelta)
                  ? dampenedDelta
                  : xDelta;
            }
          }
        }
        if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
          setIsSwiped(true);
        }
        (_toastRef_current = toastRef.current) == null
          ? void 0
          : _toastRef_current.style.setProperty(
              '--swipe-amount-x',
              `${swipeAmount.x}px`,
            );
        (_toastRef_current1 = toastRef.current) == null
          ? void 0
          : _toastRef_current1.style.setProperty(
              '--swipe-amount-y',
              `${swipeAmount.y}px`,
            );
      },
    },
    closeButton && !toast.jsx && toastType !== 'loading'
      ? /*#__PURE__*/ React.createElement(
          'button',
          {
            'aria-label': closeButtonAriaLabel,
            'data-disabled': disabled,
            'data-close-button': true,
            onClick:
              disabled || !dismissible
                ? () => {}
                : () => {
                    deleteToast();
                    toast.onDismiss == null
                      ? void 0
                      : toast.onDismiss.call(toast, toast);
                  },
            className: cn(
              classNames == null ? void 0 : classNames.closeButton,
              toast == null
                ? void 0
                : (_toast_classNames2 = toast.classNames) == null
                  ? void 0
                  : _toast_classNames2.closeButton,
            ),
          },
          (_icons_close = icons == null ? void 0 : icons.close) != null
            ? _icons_close
            : CloseIcon,
        )
      : null,
    (toastType || toast.icon || toast.promise) &&
      toast.icon !== null &&
      ((icons == null ? void 0 : icons[toastType]) !== null || toast.icon)
      ? /*#__PURE__*/ React.createElement(
          'div',
          {
            'data-icon': '',
            className: cn(
              classNames == null ? void 0 : classNames.icon,
              toast == null
                ? void 0
                : (_toast_classNames3 = toast.classNames) == null
                  ? void 0
                  : _toast_classNames3.icon,
            ),
          },
          toast.promise || (toast.type === 'loading' && !toast.icon)
            ? toast.icon || getLoadingIcon()
            : null,
          toast.type !== 'loading' ? icon : null,
        )
      : null,
    /*#__PURE__*/ React.createElement(
      'div',
      {
        'data-content': '',
        className: cn(
          classNames == null ? void 0 : classNames.content,
          toast == null
            ? void 0
            : (_toast_classNames4 = toast.classNames) == null
              ? void 0
              : _toast_classNames4.content,
        ),
      },
      /*#__PURE__*/ React.createElement(
        'div',
        {
          'data-title': '',
          className: cn(
            classNames == null ? void 0 : classNames.title,
            toast == null
              ? void 0
              : (_toast_classNames5 = toast.classNames) == null
                ? void 0
                : _toast_classNames5.title,
          ),
        },
        toast.jsx
          ? toast.jsx
          : typeof toast.title === 'function'
            ? toast.title()
            : toast.title,
      ),
      toast.description
        ? /*#__PURE__*/ React.createElement(
            'div',
            {
              'data-description': '',
              className: cn(
                descriptionClassName,
                toastDescriptionClassname,
                classNames == null ? void 0 : classNames.description,
                toast == null
                  ? void 0
                  : (_toast_classNames6 = toast.classNames) == null
                    ? void 0
                    : _toast_classNames6.description,
              ),
            },
            typeof toast.description === 'function'
              ? toast.description()
              : toast.description,
          )
        : null,
    ),
    /*#__PURE__*/ React.isValidElement(toast.cancel)
      ? toast.cancel
      : toast.cancel && isAction(toast.cancel)
        ? /*#__PURE__*/ React.createElement(
            'button',
            {
              'data-button': true,
              'data-cancel': true,
              style: toast.cancelButtonStyle || cancelButtonStyle,
              onClick: (event) => {
                // We need to check twice because typescript
                if (!isAction(toast.cancel)) return;
                if (!dismissible) return;
                toast.cancel.onClick == null
                  ? void 0
                  : toast.cancel.onClick.call(toast.cancel, event);
                deleteToast();
              },
              className: cn(
                classNames == null ? void 0 : classNames.cancelButton,
                toast == null
                  ? void 0
                  : (_toast_classNames7 = toast.classNames) == null
                    ? void 0
                    : _toast_classNames7.cancelButton,
              ),
            },
            toast.cancel.label,
          )
        : null,
    /*#__PURE__*/ React.isValidElement(toast.action)
      ? toast.action
      : toast.action && isAction(toast.action)
        ? /*#__PURE__*/ React.createElement(
            'button',
            {
              'data-button': true,
              'data-action': true,
              style: toast.actionButtonStyle || actionButtonStyle,
              onClick: (event) => {
                // We need to check twice because typescript
                if (!isAction(toast.action)) return;
                toast.action.onClick == null
                  ? void 0
                  : toast.action.onClick.call(toast.action, event);
                if (event.defaultPrevented) return;
                deleteToast();
              },
              className: cn(
                classNames == null ? void 0 : classNames.actionButton,
                toast == null
                  ? void 0
                  : (_toast_classNames8 = toast.classNames) == null
                    ? void 0
                    : _toast_classNames8.actionButton,
              ),
            },
            toast.action.label,
          )
        : null,
  );
};
function getDocumentDirection() {
  if (typeof window === 'undefined') return 'ltr';
  if (typeof document === 'undefined') return 'ltr'; // For Fresh purpose
  const dirAttribute = document.documentElement.getAttribute('dir');
  if (dirAttribute === 'auto' || !dirAttribute) {
    return window.getComputedStyle(document.documentElement).direction;
  }
  return dirAttribute;
}
function assignOffset(defaultOffset, mobileOffset) {
  const styles = {};
  [defaultOffset, mobileOffset].forEach((offset, index) => {
    const isMobile = index === 1;
    const prefix = isMobile ? '--mobile-offset' : '--offset';
    const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
    function assignAll(offset) {
      ['top', 'right', 'bottom', 'left'].forEach((key) => {
        styles[`${prefix}-${key}`] =
          typeof offset === 'number' ? `${offset}px` : offset;
      });
    }
    if (typeof offset === 'number' || typeof offset === 'string') {
      assignAll(offset);
    } else if (typeof offset === 'object') {
      ['top', 'right', 'bottom', 'left'].forEach((key) => {
        if (offset[key] === undefined) {
          styles[`${prefix}-${key}`] = defaultValue;
        } else {
          styles[`${prefix}-${key}`] =
            typeof offset[key] === 'number' ? `${offset[key]}px` : offset[key];
        }
      });
    } else {
      assignAll(defaultValue);
    }
  });
  return styles;
}
function useSonner() {
  const [activeToasts, setActiveToasts] = React.useState([]);
  React.useEffect(() => {
    return ToastState.subscribe((toast) => {
      if (toast.dismiss) {
        setTimeout(() => {
          ReactDOM.flushSync(() => {
            setActiveToasts((toasts) =>
              toasts.filter((t) => t.id !== toast.id),
            );
          });
        });
        return;
      }
      // Prevent batching, temp solution.
      setTimeout(() => {
        ReactDOM.flushSync(() => {
          setActiveToasts((toasts) => {
            const indexOfExistingToast = toasts.findIndex(
              (t) => t.id === toast.id,
            );
            // Update the toast if it already exists
            if (indexOfExistingToast !== -1) {
              return [
                ...toasts.slice(0, indexOfExistingToast),
                {
                  ...toasts[indexOfExistingToast],
                  ...toast,
                },
                ...toasts.slice(indexOfExistingToast + 1),
              ];
            }
            return [toast, ...toasts];
          });
        });
      });
    });
  }, []);
  return {
    toasts: activeToasts,
  };
}
const Toaster = /*#__PURE__*/ React.forwardRef(function Toaster(props, ref) {
  const {
    id,
    invert,
    position = 'bottom-right',
    hotkey = ['altKey', 'KeyT'],
    expand,
    closeButton,
    className,
    offset,
    mobileOffset,
    theme = 'light',
    richColors,
    duration,
    style,
    visibleToasts = VISIBLE_TOASTS_AMOUNT,
    toastOptions,
    dir = getDocumentDirection(),
    gap = GAP,
    icons,
    containerAriaLabel = 'Notifications',
  } = props;
  const [toasts, setToasts] = React.useState([]);
  const filteredToasts = React.useMemo(() => {
    if (id) {
      return toasts.filter((toast) => toast.toasterId === id);
    }
    return toasts.filter((toast) => !toast.toasterId);
  }, [toasts, id]);
  const possiblePositions = React.useMemo(() => {
    return Array.from(
      new Set(
        [position].concat(
          filteredToasts
            .filter((toast) => toast.position)
            .map((toast) => toast.position),
        ),
      ),
    );
  }, [filteredToasts, position]);
  const [heights, setHeights] = React.useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [interacting, setInteracting] = React.useState(false);
  const [actualTheme, setActualTheme] = React.useState(
    theme !== 'system'
      ? theme
      : typeof window !== 'undefined'
        ? window.matchMedia?.('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : 'light',
  );
  const listRef = React.useRef(null);
  const hotkeyLabel = hotkey
    .join('+')
    .replace(/Key/g, '')
    .replace(/Digit/g, '');
  const lastFocusedElementRef = React.useRef(null);
  const isFocusWithinRef = React.useRef(false);
  const removeToast = React.useCallback((toastToRemove) => {
    setToasts((toasts) => {
      var _toasts_find;
      if (
        !((_toasts_find = toasts.find(
          (toast) => toast.id === toastToRemove.id,
        )) == null
          ? void 0
          : _toasts_find.delete)
      ) {
        ToastState.dismiss(toastToRemove.id);
      }
      return toasts.filter(({ id }) => id !== toastToRemove.id);
    });
  }, []);
  React.useEffect(() => {
    return ToastState.subscribe((toast) => {
      if (toast.dismiss) {
        // Prevent batching of other state updates
        requestAnimationFrame(() => {
          setToasts((toasts) =>
            toasts.map((t) =>
              t.id === toast.id
                ? {
                    ...t,
                    delete: true,
                  }
                : t,
            ),
          );
        });
        return;
      }
      // Prevent batching, temp solution.
      setTimeout(() => {
        ReactDOM.flushSync(() => {
          setToasts((toasts) => {
            const indexOfExistingToast = toasts.findIndex(
              (t) => t.id === toast.id,
            );
            // Update the toast if it already exists
            if (indexOfExistingToast !== -1) {
              return [
                ...toasts.slice(0, indexOfExistingToast),
                {
                  ...toasts[indexOfExistingToast],
                  ...toast,
                },
                ...toasts.slice(indexOfExistingToast + 1),
              ];
            }
            return [toast, ...toasts];
          });
        });
      });
    });
  }, [toasts]);
  React.useEffect(() => {
    if (theme !== 'system') {
      setActualTheme(theme);
      return;
    }
    if (theme === 'system') {
      // check if current preference is dark
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        // it's currently dark
        setActualTheme('dark');
      } else {
        // it's not dark
        setActualTheme('light');
      }
    }
    if (typeof window === 'undefined') return;
    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    try {
      // Chrome & Firefox
      darkMediaQuery.addEventListener('change', ({ matches }) => {
        if (matches) {
          setActualTheme('dark');
        } else {
          setActualTheme('light');
        }
      });
    } catch {
      // Safari < 14
      darkMediaQuery.addListener(({ matches }) => {
        try {
          if (matches) {
            setActualTheme('dark');
          } else {
            setActualTheme('light');
          }
        } catch (e) {
          console.error(e);
        }
      });
    }
  }, [theme]);
  React.useEffect(() => {
    // Ensure expanded is always false when no toasts are present / only one left
    if (toasts.length <= 1) {
      setExpanded(false);
    }
  }, [toasts]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      var _listRef_current;
      const isHotkeyPressed = hotkey.every(
        (key) => event[key] || event.code === key,
      );
      if (isHotkeyPressed) {
        var _listRef_current1;
        setExpanded(true);
        (_listRef_current1 = listRef.current) == null
          ? void 0
          : _listRef_current1.focus();
      }
      if (
        event.code === 'Escape' &&
        (document.activeElement === listRef.current ||
          ((_listRef_current = listRef.current) == null
            ? void 0
            : _listRef_current.contains(document.activeElement)))
      ) {
        setExpanded(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hotkey]);
  React.useEffect(() => {
    if (listRef.current) {
      return () => {
        if (lastFocusedElementRef.current) {
          lastFocusedElementRef.current.focus({
            preventScroll: true,
          });
          lastFocusedElementRef.current = null;
          isFocusWithinRef.current = false;
        }
      };
    }
  }, [listRef.current]);
  return (
    // Remove item from normal navigation flow, only available via hotkey
    /*#__PURE__*/ React.createElement(
      'section',
      {
        ref: ref,
        'aria-label': `${containerAriaLabel} ${hotkeyLabel}`,
        tabIndex: -1,
        'aria-live': 'polite',
        'aria-relevant': 'additions text',
        'aria-atomic': 'false',
        suppressHydrationWarning: true,
      },
      possiblePositions.map((position, index) => {
        var _heights_;
        const [y, x] = position.split('-');
        if (!filteredToasts.length) return null;
        return /*#__PURE__*/ React.createElement(
          'ol',
          {
            key: position,
            dir: dir === 'auto' ? getDocumentDirection() : dir,
            tabIndex: -1,
            ref: listRef,
            className: className,
            'data-sonner-toaster': true,
            'data-sonner-theme': actualTheme,
            'data-y-position': y,
            'data-x-position': x,
            style: {
              '--front-toast-height': `${
                ((_heights_ = heights[0]) == null
                  ? void 0
                  : _heights_.height) || 0
              }px`,
              '--width': `${TOAST_WIDTH}px`,
              '--gap': `${gap}px`,
              ...style,
              ...assignOffset(offset, mobileOffset),
            },
            onBlur: (event) => {
              if (
                isFocusWithinRef.current &&
                !event.currentTarget.contains(event.relatedTarget)
              ) {
                isFocusWithinRef.current = false;
                if (lastFocusedElementRef.current) {
                  lastFocusedElementRef.current.focus({
                    preventScroll: true,
                  });
                  lastFocusedElementRef.current = null;
                }
              }
            },
            onFocus: (event) => {
              const isNotDismissible =
                event.target instanceof HTMLElement &&
                event.target.dataset.dismissible === 'false';
              if (isNotDismissible) return;
              if (!isFocusWithinRef.current) {
                isFocusWithinRef.current = true;
                lastFocusedElementRef.current = event.relatedTarget;
              }
            },
            onMouseEnter: () => setExpanded(true),
            onMouseMove: () => setExpanded(true),
            onMouseLeave: () => {
              // Avoid setting expanded to false when interacting with a toast, e.g. swiping
              if (!interacting) {
                setExpanded(false);
              }
            },
            onDragEnd: () => setExpanded(false),
            onPointerDown: (event) => {
              const isNotDismissible =
                event.target instanceof HTMLElement &&
                event.target.dataset.dismissible === 'false';
              if (isNotDismissible) return;
              setInteracting(true);
            },
            onPointerUp: () => setInteracting(false),
          },
          filteredToasts
            .filter(
              (toast) =>
                (!toast.position && index === 0) || toast.position === position,
            )
            .map((toast, index) => {
              var _toastOptions_duration, _toastOptions_closeButton;
              return /*#__PURE__*/ React.createElement(Toast, {
                key: toast.id,
                icons: icons,
                index: index,
                toast: toast,
                defaultRichColors: richColors,
                duration:
                  (_toastOptions_duration =
                    toastOptions == null ? void 0 : toastOptions.duration) !=
                  null
                    ? _toastOptions_duration
                    : duration,
                className:
                  toastOptions == null ? void 0 : toastOptions.className,
                descriptionClassName:
                  toastOptions == null
                    ? void 0
                    : toastOptions.descriptionClassName,
                invert: invert,
                visibleToasts: visibleToasts,
                closeButton:
                  (_toastOptions_closeButton =
                    toastOptions == null ? void 0 : toastOptions.closeButton) !=
                  null
                    ? _toastOptions_closeButton
                    : closeButton,
                interacting: interacting,
                position: position,
                style: toastOptions == null ? void 0 : toastOptions.style,
                unstyled: toastOptions == null ? void 0 : toastOptions.unstyled,
                classNames:
                  toastOptions == null ? void 0 : toastOptions.classNames,
                cancelButtonStyle:
                  toastOptions == null
                    ? void 0
                    : toastOptions.cancelButtonStyle,
                actionButtonStyle:
                  toastOptions == null
                    ? void 0
                    : toastOptions.actionButtonStyle,
                closeButtonAriaLabel:
                  toastOptions == null
                    ? void 0
                    : toastOptions.closeButtonAriaLabel,
                removeToast: removeToast,
                toasts: filteredToasts.filter(
                  (t) => t.position == toast.position,
                ),
                heights: heights.filter((h) => h.position == toast.position),
                setHeights: setHeights,
                expandByDefault: expand,
                gap: gap,
                expanded: expanded,
                swipeDirections: props.swipeDirections,
              });
            }),
        );
      }),
    )
  );
});

export { Toaster, toast, useSonner };
