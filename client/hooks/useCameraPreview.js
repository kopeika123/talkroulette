"use client";

import { useEffect, useRef, useState } from "react";

export function useCameraPreview() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!videoRef.current || !streamRef.current) {
      return;
    }

    videoRef.current.srcObject = streamRef.current;
  }, [isReady]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    if (isStarting || isReady) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Browser does not support camera access.");
      return;
    }

    setIsStarting(true);
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsReady(true);
    } catch {
      setError("Camera access was denied. You can still explore the UI.");
    } finally {
      setIsStarting(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsReady(false);
  };

  return {
    actions: {
      startCamera,
      stopCamera,
    },
    error,
    isReady,
    isStarting,
    videoRef,
  };
}
