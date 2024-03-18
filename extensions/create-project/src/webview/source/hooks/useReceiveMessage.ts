import { useCallback, useEffect } from "react";

const useReceiveMessage = (
  handlers: {
    [key: string]: (payload: any) => void;
  },
  depend: any
) => {
  const handleMessageFromVscode = useCallback(
    ({ data: { type, payload } }: MessageEvent<any>) => {
      console.info("receive message from vscode: ", type, payload);
      const keys = Object.keys(handlers);
      const handlerKey = keys.find((k) => k === type);

      if (handlerKey) {
        handlers[handlerKey](payload);
      }
    },
    depend
  );

  useEffect(() => {
    window.addEventListener("message", handleMessageFromVscode);

    return () => window.removeEventListener("message", handleMessageFromVscode);
  }, [handleMessageFromVscode]);
};

export default useReceiveMessage;