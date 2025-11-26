import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import EditorMain from "./pages/EditorPage.jsx";
import Header from "./components/UI/Header.jsx";
  createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Header />    
        <EditorMain />
    </StrictMode>
);
