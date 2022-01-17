import { Toaster, ToastBar, toast, ToastOptions } from 'react-hot-toast';
import { CheckIcon, ExclamationCircleIcon, ExclamationIcon } from '@heroicons/react/outline';


export function SuccessNotificationIcon() {
  return (
    <div className='p-1 rounded-full bg-success-100 border-4 border-success-50'>
      <CheckIcon className="h-4 w-4" />
    </div>
  );
} 
export function ErrorNotificationIcon() {
  return (
    <div className='p-1 rounded-full bg-error-100 border-4 border-error-50'>
      <ExclamationCircleIcon className="h-4 w-4" />
    </div>
  );
}
export function WarningNotificationIcon() {
  return (
    <div className='p-1 rounded-full bg-warning-100 border-4 border-warning-50'>
      <ExclamationIcon className="h-4 w-4" />
    </div>
  );
}

export function Notification() {
  return (
    <Toaster position="top-right">
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              <span className='text-sm font-medium text-gray-900'>
                {message}
              </span>
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}

export function success(message: string, options?: ToastOptions) {
  toast.success(message, { icon: <SuccessNotificationIcon />, ...options });
}


export function error(message: string, options?: ToastOptions) {
  toast.error(message, { icon: <ErrorNotificationIcon />, ...options });
}


export function warning(message: string, options?: ToastOptions) {
  toast(message, { icon: <WarningNotificationIcon />, ...options });
}
