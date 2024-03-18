import { useCallback } from "react";

const useSendMessage = () => {
  const sendMessage = useCallback((type: string, payload?: any) => {
    console.info("send message: ", type, payload);
    //@ts-ignore
    vscode.postMessage({
      type,
      payload,
    });
  }, []);

  return [sendMessage];
};

export default useSendMessage;
