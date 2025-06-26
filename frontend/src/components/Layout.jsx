import React from "react";
import Chatbot from "./Chatbot";

const Layout = ({ children }) => {
  return (
    <div>
      {children}
      <Chatbot />
    </div>
  );
};

export default Layout;
