import api from "../api";
import { toast } from "react-toastify";

export const onSubmit = (e, email, password, updateStore) => {
  // prevent default so page doesn't reload
  e.preventDefault();
  // data object to send to login req
  const data = {
    email,
    password,
  };
  // Using global api to post data on server and handling the response
  api("post", "/Architects/login", data).then((response) => {
    if (response.data.success) {
      localStorage.setItem("token", response.data.result.token);
      updateStore({ loggedIn: true, user: response.data.result.user });
      toast.success(response.data.message);
    } else {
      updateStore({ loggedIn: false, user: {} });
    }
  });
};
