import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type MessageContextType = {
  message: { type: string; text: string } | undefined;
  setMessage: Dispatch<
    SetStateAction<{ type: string; text: string } | undefined>
  >;
};

const MessageContext = createContext<MessageContextType>({
  message: undefined,
  setMessage: () => {
    return undefined;
  },
});

export function useMessageContext() {
  return useContext(MessageContext);
}

export function MessageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [message, setMessage] =
    useState<MessageContextType["message"]>(undefined);

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
}
