// Init
import React from "react";
import { UpdateStore } from "../StoreContext";

// Importing Components
import Header from "../components/Header";

// Home Component
export default function Home() {
  const updateStore = UpdateStore();
  //   logout function
  const onLogout = () => {
    localStorage.removeItem("token");
    updateStore({ loggedIn: false, user: {} });
  };
  return (
    <div>
      <Header />
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
