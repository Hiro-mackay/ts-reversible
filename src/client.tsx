import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./components/routes";
import { RouterProvider } from "react-router-dom";
import { MessageContextProvider } from "./components/message/context";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MessageContextProvider>
        <RouterProvider router={router} />
      </MessageContextProvider>
    </QueryClientProvider>
  );
}

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(<App />);
