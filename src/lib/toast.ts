import Toast from "react-native-toast-message";

export const showToast = {
  success: (message: string) => {
    Toast.show({
      type: "success",
      text1: "Success",
      text2: message,
      visibilityTime: 3000,
    });
  },

  error: (message: string) => {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: message,
      visibilityTime: 4000,
    });
  },

  info: (message: string) => {
    Toast.show({
      type: "info",
      text1: "Info",
      text2: message,
      visibilityTime: 3000,
    });
  },

  loading: (message: string) => {
    Toast.show({
      type: "info",
      text1: "Loading",
      text2: message,
      autoHide: false,
    });
  },

  hide: () => {
    Toast.hide();
  },
};
