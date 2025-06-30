import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./providers/theme-provider";
import "./index.css"
import ChatPage from "./chat";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark"  storageKey="vite-ui-theme">
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="/chat/:id" element={<ChatPage />} />
        </Routes>
      </QueryClientProvider>
      
    </BrowserRouter>
  </ThemeProvider>
);
