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
  reset: () => void;
};

const MessageContext = createContext<MessageContextType>({
  message: undefined,
  setMessage: () => {
    return undefined;
  },
  reset: () => {
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

  const reset = () => {
    setMessage(undefined);
  };

  return (
    <MessageContext.Provider value={{ message, setMessage, reset }}>
      {children}
    </MessageContext.Provider>
  );
}
