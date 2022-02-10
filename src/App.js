// Init
import React, { useEffect } from "react";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UpdateStore } from "./StoreContext";
import axios from "axios";

// Files
import Index from "./routes/index";
import "./css/index.css";

// Component
function App() {
  // getting update store function from update store context
  const updateStore = UpdateStore();

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, []);

  const fetch = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers = {
        Authorization: `Bearer ${token}`,
      };
      const result = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/Architects/current/loggedIn`
      );
      // settin user value in store if logged in
      if (result.data.user) {
        updateStore({ loggedIn: true, user: result.data.user });
      }
    }
  };

  return (
    <div className="App">
      {/* toastify Container for Notification */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        transition={Flip}
      />

      {/* Routes */}
      <Index />
    </div>
  );
}

// Export
export default App;
