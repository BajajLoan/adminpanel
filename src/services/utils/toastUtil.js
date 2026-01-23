import { toast } from "react-toastify";

const toastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

/* SUCCESS */
export const showSuccess = (message = "Success") => {
  toast.success(message, toastOptions);
};

/* ERROR */
export const showError = (message = "Something went wrong") => {
  toast.error(message, toastOptions);
};

/* INFO */
export const showInfo = (message = "") => {
  toast.info(message, toastOptions);
};

/* WARNING */
export const showWarning = (message = "") => {
  toast.warn(message, toastOptions);
};
