"use client";

import { useEffect, useRef } from "react";

export type PublicEventName =
  | "courses_updated"
  | "categories_updated"
  | "site_content_updated"
  | "public_settings_updated"
  | "faqs_updated"
  | "testimonials_updated";

/**
 * React hook subscribing to the backend public Server-Sent Events (SSE) stream.
 * Automatically handles connection, graceful reconnects with backoff,
 * event dispatching, and teardown cleanup on component unmount.
 */
export function usePublicRealtime(
  onEvent?: (event: string, data: any) => void,
  eventFilter?: PublicEventName[]
) {
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;

  useEffect(() => {
    // Avoid connecting to localhost when deployed on Firebase / cloud without a configured backend
    if (typeof window !== "undefined") {
      const isLocalhost =
        window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (!isLocalhost && !process.env.NEXT_PUBLIC_API_URL) {
        return;
      }
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isMounted = true;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 2;

    const connect = () => {
      if (!isMounted || reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return;

      try {
        const streamUrl = `${API_BASE}/events/stream`;
        eventSource = new EventSource(streamUrl);

        eventSource.onopen = () => {
          reconnectAttempts = 0;
        };

        const eventNames: PublicEventName[] = [
          "courses_updated",
          "categories_updated",
          "site_content_updated",
          "public_settings_updated",
          "faqs_updated",
          "testimonials_updated",
        ];

        eventNames.forEach((name) => {
          if (!eventFilter || eventFilter.includes(name)) {
            eventSource?.addEventListener(name, (e: MessageEvent) => {
              try {
                const parsed = JSON.parse(e.data);
                handlerRef.current?.(name, parsed);
              } catch {
                handlerRef.current?.(name, {});
              }
            });
          }
        });

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          reconnectAttempts++;
          if (isMounted && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 5000);
            reconnectTimeout = setTimeout(connect, delay);
          }
        };
      } catch {
        // SSE unsupported or network unavailable
      }
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventFilter]);
}
