import { Flip, ToastOptions } from "react-toastify";

export const ToastDefault = {
  hideProgressBar: false,
  newestOnTop: false,
  autoClose: 5000,
  draggable: true,
  closeOnClick: true,
  transition: Flip,
} as ToastOptions<{}>;
