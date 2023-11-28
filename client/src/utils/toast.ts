import { toast, type ToastOptions } from 'vue3-toastify';

export const showToast = (message: string, ToastType: string) => {
    switch (ToastType) {
        case 'success':
            toast.success(message, {
                timeout: 3000,
                icon: '👏',
            } as ToastOptions);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'warning':
            toast.warning(message);
            break;
    }
};
