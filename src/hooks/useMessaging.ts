
import { useThreads } from "./messaging/useThreads";
import { useMessages } from "./messaging/useMessages";
import { useThreadCreation } from "./messaging/useThreadCreation";
import { useRealtimeSubscription } from "./messaging/useRealtimeSubscription";

export const useMessaging = () => {
  const { threads, loading: threadsLoading, fetchThreads } = useThreads();
  const { 
    messages, 
    activeThread, 
    loading: messagesLoading, 
    fetchMessages, 
    sendMessage 
  } = useMessages();
  const { createThread } = useThreadCreation();
  const { subscribeToThread } = useRealtimeSubscription();

  const loading = threadsLoading || messagesLoading;

  return {
    threads,
    messages,
    activeThread,
    loading,
    fetchThreads,
    fetchMessages,
    sendMessage,
    createThread,
    subscribeToThread
  };
};
