
  import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ApiProvider } from "./contexts/ApiContext.tsx";
import { NaoProvider } from "./contexts/NaoContext.tsx";

console.log("Backend URL from env:", import.meta.env.VITE_BACKEND_URL);

createRoot(document.getElementById("root")!).render(
  <NaoProvider>
    <ApiProvider>
      <App />
    </ApiProvider>
  </NaoProvider>
);

  