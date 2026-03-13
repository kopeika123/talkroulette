"use client";

import { Room, RoomEvent, Track } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { createAutoReply, createIntroMessage } from "../lib/chat-roulette/messageFactory";
import { createPresenceService } from "../lib/chat-roulette/presenceService";
import { useCameraPreview } from "./useCameraPreview";

const presenceService = createPresenceService();
const DEFAULT_ROOM_NAME = "talkroulette-lobby";

const buildPartnerProfile = (participant) => {
  const name = participant.name || participant.identity || "Guest";

  return {
    name,
    city: "LiveKit room",
    status: "Connected now",
  };
};

const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
};

const getLivekitUrl = () => {
  return process.env.NEXT_PUBLIC_LIVEKIT_URL || "";
};

const fetchLivekitToken = async ({ name }) => {
  const response = await fetch(`${getApiBaseUrl()}/livekit/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      roomName: DEFAULT_ROOM_NAME,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get LiveKit token: ${response.status}`);
  }

  return response.json();
};

export function useChatRouletteSession() {
  const camera = useCameraPreview();
  const replyTimerRef = useRef(null);
  const roomRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteTrackRef = useRef(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    interests: "music, startups, travel",
  });
  const [messageDraft, setMessageDraft] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineCount, setOnlineCount] = useState(presenceService.getInitialCount());
  const [connectionError, setConnectionError] = useState("");

  useEffect(() => {
    const timerId = window.setInterval(() => {
      if (!roomRef.current) {
        setOnlineCount((count) => presenceService.getNextCount(count));
        return;
      }

      setOnlineCount(roomRef.current.numParticipants);
    }, 3000);

    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) {
        window.clearTimeout(replyTimerRef.current);
      }

      if (remoteTrackRef.current) {
        remoteTrackRef.current.detach();
        remoteTrackRef.current = null;
      }

      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
    };
  }, []);

  const updateName = (name) => {
    setProfileForm((current) => ({ ...current, name }));
  };

  const updateInterests = (interests) => {
    setProfileForm((current) => ({ ...current, interests }));
  };

  const updateMessageDraft = (nextDraft) => {
    setMessageDraft(nextDraft);
  };

  const resetConversation = () => {
    setPartner(null);
    setMessages([]);

    if (remoteTrackRef.current) {
      remoteTrackRef.current.detach();
      remoteTrackRef.current = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const stopSession = () => {
    if (replyTimerRef.current) {
      window.clearTimeout(replyTimerRef.current);
    }

    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }

    setIsSearching(false);
    setMessageDraft("");
    setConnectionError("");
    resetConversation();
  };

  const attachRemoteTrack = (track, participant) => {
    if (track.kind !== Track.Kind.Video || !remoteVideoRef.current) {
      return;
    }

    if (remoteTrackRef.current) {
      remoteTrackRef.current.detach();
    }

    track.attach(remoteVideoRef.current);
    remoteTrackRef.current = track;
    setPartner(buildPartnerProfile(participant));
    setMessages([createIntroMessage(buildPartnerProfile(participant))]);
    setIsSearching(false);
  };

  const bindRoomEvents = (room) => {
    room.on(RoomEvent.ParticipantConnected, (participant) => {
      setPartner(buildPartnerProfile(participant));
      setIsSearching(true);
    });

    room.on(RoomEvent.ParticipantDisconnected, () => {
      resetConversation();
      setIsSearching(true);
    });

    room.on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
      attachRemoteTrack(track, participant);
    });

    room.on(RoomEvent.TrackUnsubscribed, (track) => {
      if (track.kind !== Track.Kind.Video) {
        return;
      }

      track.detach();
      remoteTrackRef.current = null;
      resetConversation();
      setIsSearching(true);
    });

    room.on(RoomEvent.Disconnected, () => {
      roomRef.current = null;
      resetConversation();
      setIsSearching(false);
    });
  };

  const startSearch = async () => {
    if (roomRef.current) {
      return;
    }

    if (!getLivekitUrl()) {
      setConnectionError("NEXT_PUBLIC_LIVEKIT_URL is not configured.");
      return;
    }

    if (!camera.isReady) {
      setConnectionError("Enable the camera before starting the search.");
      return;
    }

    setConnectionError("");
    setIsSearching(true);
    resetConversation();

    try {
      const displayName = profileForm.name.trim() || `Guest-${crypto.randomUUID().slice(0, 8)}`;
      const tokenPayload = await fetchLivekitToken({ name: displayName });
      const room = new Room();

      bindRoomEvents(room);

      await room.connect(tokenPayload.serverUrl || getLivekitUrl(), tokenPayload.token);
      roomRef.current = room;
      setOnlineCount(room.numParticipants);

      await room.localParticipant.setCameraEnabled(true);

      const firstRemoteParticipant = Array.from(room.remoteParticipants.values())[0];

      if (firstRemoteParticipant) {
        setPartner(buildPartnerProfile(firstRemoteParticipant));
      }
    } catch (error) {
      console.error(error);
      setConnectionError("Unable to connect to LiveKit.");
      setIsSearching(false);
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
    }
  };

  const sendMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = messageDraft.trim();

    if (!trimmedMessage || !partner) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        author: "you",
        text: trimmedMessage,
      },
    ]);
    setMessageDraft("");

    replyTimerRef.current = window.setTimeout(() => {
      setMessages((current) => [...current, createAutoReply()]);
    }, 900);
  };

  return {
    camera,
    connectionError,
    isSearching,
    messageDraft,
    messages,
    onlineCount,
    partner,
    profileForm,
    remoteVideoRef,
    actions: {
      sendMessage,
      startSearch,
      stopSession,
      updateInterests,
      updateMessageDraft,
      updateName,
    },
  };
}
