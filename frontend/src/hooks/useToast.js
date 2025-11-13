import { toast } from 'sonner';

export const useToast = () => {
  const showSuccess = (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  };

  const showError = (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
    });
  };

  const showInfo = (message) => {
    toast.info(message, {
      duration: 3000,
      position: 'top-right',
    });
  };

  const showWarning = (message) => {
    toast.warning(message, {
      duration: 3000,
      position: 'top-right',
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};

export default useToast;

