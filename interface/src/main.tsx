
  import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ApiProvider } from "./contexts/ApiContext.tsx";
import { NaoProvider } from "./contexts/NaoContext.tsx";

createRoot(document.getElementById("root")!).render(
  <NaoProvider>
    <ApiProvider>
      <App />
    </ApiProvider>
  </NaoProvider>
);

  