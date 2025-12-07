"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  FiMic, FiMicOff, FiVideo, FiVideoOff, FiUsers, FiUserPlus,
  FiShare2, FiMessageCircle, FiActivity, FiBell, FiClock,
  FiSun, FiMoon, FiArrowLeft, FiX, FiSend, FiCheckCircle,
  FiAlertCircle, FiMail, FiSettings, FiZoomIn, FiZoomOut,
  FiGrid, FiMaximize2, FiTrash2, FiCopy, FiLock, FiUnlock,
  FiRotateCcw, FiRotateCw, FiDownload, FiLayers, FiHelpCircle,
  FiMousePointer, FiMove, FiSquare, FiCircle, FiArrowRight,
  FiMinus, FiEdit3, FiType, FiFileText, FiMessageSquare,
  FiThumbsUp, FiHeart, FiZap, FiEye, FiPlus
} from "react-icons/fi";
import { MdLocalHospital } from "react-icons/md";
import { GiThroneKing } from "react-icons/gi";

// --- Types ---
type Props = {
  params: Promise<{ slug: string }>;
};

interface Point {
  x: number;
  y: number;
}

interface DrawElement {
  id: string;
  type: string;
  startPoint: Point;
  endPoint?: Point;
  points?: Point[];
  color: string;
  fillColor: string;
  strokeWidth: number;
  text?: string;
  opacity?: number;
  locked?: boolean;
  comments?: Comment[];
  reactions?: Reaction[];
  createdBy?: string;
  createdAt?: number;
}

interface RemoteCursor {
  clientId: string;
  x: number;
  y: number;
  color: string;
  username: string;
  avatar: string;
  status: "online" | "busy" | "away";
  role: "admin" | "editor" | "viewer";
}

interface VideoStream {
  clientId: string;
  stream: MediaStream;
  username: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: number;
  mentions?: string[];
  replyTo?: string;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: number;
}

interface Activity {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  action: string;
  details: string;
  timestamp: number;
  type: "create" | "update" | "delete" | "invite" | "join" | "comment";
}

interface Notification {
  id: string;
  type: "mention" | "comment" | "update" | "invite";
  message: string;
  timestamp: number;
  read: boolean;
}

interface Reaction {
  userId: string;
  username: string;
  emoji: string;
  timestamp: number;
}

// --- WebRTC Config ---
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478" }
  ]
};

// --- Template Generator ---
const generateTemplate = (type: string): DrawElement[] => {
  const baseId = Date.now().toString();
  const createId = (idx: number) => `${baseId}-${idx}`;
  const elements: DrawElement[] = [];

  switch (type.toLowerCase()) {
    case "kanban": {
      const kCols = ["To Do", "In Progress", "Done"];
      kCols.forEach((col, i) => {
        elements.push({
          id: createId(i),
          type: "rectangle",
          startPoint: { x: 100 + i * 320, y: 100 },
          endPoint: { x: 400 + i * 320, y: 160 },
          color: "#ffffff",
          fillColor: "#2d3436",
          strokeWidth: 2,
          createdAt: Date.now()
        });
        elements.push({
          id: createId(i + 10),
          type: "text",
          startPoint: { x: 120 + i * 320, y: 140 },
          color: "#ffffff",
          fillColor: "transparent",
          strokeWidth: 3,
          text: col,
          createdAt: Date.now()
        });
        elements.push({
          id: createId(i + 20),
          type: "rectangle",
          startPoint: { x: 100 + i * 320, y: 170 },
          endPoint: { x: 400 + i * 320, y: 600 },
          color: "#ffffff40",
          fillColor: "transparent",
          strokeWidth: 2,
          createdAt: Date.now()
        });
      });
      break;
    }

    case "brainstorm": {
      elements.push({
        id: createId(1),
        type: "text",
        startPoint: { x: 350, y: 80 },
        color: "#ffffff",
        fillColor: "transparent",
        strokeWidth: 4,
        text: "Brainstorming Session",
        createdAt: Date.now()
      });
      const stickies = ["#ff7675", "#ffeaa7", "#74b9ff", "#55efc4"];
      stickies.forEach((color, i) => {
        elements.push({
          id: createId(i + 10),
          type: "sticky",
          startPoint: { x: 100 + i * 180, y: 150 },
          endPoint: { x: 250 + i * 180, y: 300 },
          color: "#ffffff",
          fillColor: color,
          strokeWidth: 1,
          text: "Idea " + (i + 1),
          createdAt: Date.now()
        });
      });
      break;
    }

    case "flowchart": {
      elements.push({
        id: createId(1),
        type: "circle",
        startPoint: { x: 400, y: 50 },
        endPoint: { x: 550, y: 120 },
        color: "#74b9ff",
        fillColor: "#000",
        strokeWidth: 2,
        createdAt: Date.now()
      });
      elements.push({
        id: createId(2),
        type: "text",
        startPoint: { x: 450, y: 95 },
        color: "#fff",
        fillColor: "transparent",
        strokeWidth: 2,
        text: "Start",
        createdAt: Date.now()
      });
      break;
    }

    case "mindmap": {
      elements.push({
        id: createId(1),
        type: "circle",
        startPoint: { x: 400, y: 300 },
        endPoint: { x: 600, y: 450 },
        color: "#a29bfe",
        fillColor: "#a29bfe40",
        strokeWidth: 2,
        createdAt: Date.now()
      });
      elements.push({
        id: createId(2),
        type: "text",
        startPoint: { x: 460, y: 385 },
        color: "#fff",
        fillColor: "transparent",
        strokeWidth: 3,
        text: "Main Idea",
        createdAt: Date.now()
      });
      break;
    }
  }
  return elements;
};

// --- Main Component ---
export default function WhiteboardPage({ params }: Props) {
  const [slug, setSlug] = useState<string>("");
  const socketRef = useRef<WebSocket | null>(null);
  const [clientId, setClientId] = useState<string>("");
  const [remoteCursors, setRemoteCursors] = useState<RemoteCursor[]>([]);
  const lastCursorUpdate = useRef<number>(0);

  const userColor = useMemo(() => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F033FF", "#FF33A8", "#33FFF5"];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  // User Profile
  const [currentUser, setCurrentUser] = useState({
    username: "You",
    avatar: "https://ui-avatars.com/api/?name=You&background=random",
    status: "online" as "online" | "busy" | "away",
    role: "admin" as "admin" | "editor" | "viewer"
  });

  // Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [fillColor, setFillColor] = useState("transparent");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity, setOpacity] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [gridSnap, setGridSnap] = useState(false);
  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [currentElement, setCurrentElement] = useState<DrawElement | null>(null);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [history, setHistory] = useState<DrawElement[][]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Selection & Editing
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [textInputPos, setTextInputPos] = useState<Point>({ x: 0, y: 0 });

  // Voice & Video
  const [isMicOn, setIsMicOn] = useState(false);
  const localAudioStreamRef = useRef<MediaStream | null>(null);
  const audioPeersRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  const [isVideoOn, setIsVideoOn] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const localVideoStreamRef = useRef<MediaStream | null>(null);
  const videoPeersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [remoteVideoStreams, setRemoteVideoStreams] = useState<VideoStream[]>([]);

  // UI Features
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [bgPattern, setBgPattern] = useState<"grid" | "dots" | "lines" | "none">("grid");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Invite System
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [inviteStatus, setInviteStatus] = useState("");

  // Chat System
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Activity Feed
  const [activities, setActivities] = useState<Activity[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Comments
  const [commentInput, setCommentInput] = useState("");
  const [showCommentFor, setShowCommentFor] = useState<string | null>(null);

  // --- INIT SLUG ---
  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  // --- NEW: Capture token from URL and store in localStorage (for shared links) ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      const urlToken = url.searchParams.get("token");
      if (urlToken) {
        localStorage.setItem("auth_token", urlToken);
      }
    } catch {
      // ignore URL parse errors
    }
  }, []);

  // Share URL (now includes token when available)
  useEffect(() => {
    if (typeof window !== "undefined" && slug) {
      const base = `${window.location.origin}/workspace/${slug}`;
      const token = typeof window !== "undefined"
        ? localStorage.getItem("auth_token")
        : null;
      if (token) {
        setShareUrl(`${base}?token=${encodeURIComponent(token)}`);
      } else {
        setShareUrl(base);
      }
    }
  }, [slug]);

  // Theme Effect
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  // WebSocket (updated to require non-empty token and URL-encode it)
  useEffect(() => {
    if (!slug) return;

    const token = (typeof window !== "undefined")
      ? localStorage.getItem("auth_token")
      : null;

    if (!token) {
      console.error("❌ No auth token found, skipping WebSocket connection");
      return;
    }

    const wsUrl = `ws://localhost:5000/ws/whiteboard/${slug}?token=${encodeURIComponent(
      token
    )}`;
    const ws = new WebSocket(wsUrl);

    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        await handleSocketMessage(message);
      } catch (error) {
        console.error("Socket parse error", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket disconnected");
    };

    return () => {
      if (localAudioStreamRef.current) {
        localAudioStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (localVideoStreamRef.current) {
        localVideoStreamRef.current.getTracks().forEach(track => track.stop());
      }
      ws.close();
    };
  }, [slug]);

  const addToHistory = (newElements: DrawElement[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const addNotification = (type: Notification["type"], message: string) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // WebRTC
  const createPeer = (
    targetId: string,
    stream: MediaStream | null,
    type: "voice" | "video",
    peersMap: Map<string, RTCPeerConnection>
  ) => {
    if (peersMap.has(targetId)) return peersMap.get(targetId)!;
    const peer = new RTCPeerConnection(ICE_SERVERS);
    peersMap.set(targetId, peer);

    if (stream) stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate && socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: type === "voice" ? "voice_signal" : "video_signal",
          targetId: targetId,
          signal: { type: "candidate", candidate: event.candidate }
        }));
      }
    };

    peer.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (!remoteStream) return;

      if (type === "voice") {
        const audioId = `audio-${targetId}`;
        let audio = document.getElementById(audioId) as HTMLAudioElement;
        if (!audio) {
          audio = document.createElement("audio");
          audio.id = audioId;
          audio.autoplay = true;
          (audio as any).playsInline = true;
          document.body.appendChild(audio);
        }
        audio.srcObject = remoteStream;
      } else if (type === "video") {
        setRemoteVideoStreams(prev => {
          if (prev.find(v => v.clientId === targetId)) return prev;
          const userCursor = remoteCursors.find(c => c.clientId === targetId);
          return [
            ...prev,
            {
              clientId: targetId,
              stream: remoteStream,
              username: userCursor?.username || "User"
            }
          ];
        });
      }
    };

    return peer;
  };

  const toggleMic = async () => {
    if (isMicOn) {
      if (localAudioStreamRef.current) {
        localAudioStreamRef.current.getTracks().forEach(track => track.stop());
        localAudioStreamRef.current = null;
      }
      setIsMicOn(false);
      socketRef.current?.send(JSON.stringify({ type: "leave_voice" }));
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localAudioStreamRef.current = stream;
        setIsMicOn(true);
        socketRef.current?.send(JSON.stringify({ type: "join_voice" }));
      } catch (err) {
        console.error("Mic error", err);
      }
    }
  };

  const toggleVideo = async () => {
    if (isVideoOn) {
      if (localVideoStreamRef.current) {
        localVideoStreamRef.current.getTracks().forEach(track => track.stop());
        localVideoStreamRef.current = null;
      }
      setIsVideoOn(false);
      setShowVideoCall(false);
      socketRef.current?.send(JSON.stringify({ type: "leave_video" }));
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        localVideoStreamRef.current = stream;
        setIsVideoOn(true);
        setShowVideoCall(true);
        socketRef.current?.send(JSON.stringify({ type: "join_video" }));
      } catch (err) {
        console.error("Camera error", err);
      }
    }
  };

  // Chat Functions
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;

    socketRef.current?.send(JSON.stringify({
      type: "chat_message",
      message: chatInput
    }));

    setChatInput("");
  };

  const handleChatTyping = (text: string) => {
    setChatInput(text);
    if (text && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "typing_start" }));
    }
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Comment Functions
  const addComment = () => {
    if (!commentInput.trim() || !selectedElementId) return;

    socketRef.current?.send(JSON.stringify({
      type: "add_comment",
      elementId: selectedElementId,
      text: commentInput
    }));

    setCommentInput("");
    setShowCommentFor(null);
  };

  // Reaction Functions
  const addReaction = (elementId: string, emoji: string) => {
    socketRef.current?.send(JSON.stringify({
      type: "add_reaction",
      elementId,
      emoji
    }));
  };

  // Invite User Function
  const handleInviteUser = async () => {
    if (!inviteEmail || !inviteEmail.includes("@")) {
      setInviteStatus("Please enter a valid email");
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`http://localhost:5000/api/dashboards/${slug}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email: inviteEmail })
      });

      if (response.ok) {
        setInvitedUsers([...invitedUsers, inviteEmail]);
        setInviteStatus(`✓ Invited ${inviteEmail}`);
        setInviteEmail("");
        setTimeout(() => setInviteStatus(""), 3000);
        addNotification("invite", `Invited ${inviteEmail} to board`);
      } else {
        setInviteStatus("✗ Failed to send invite");
      }
    } catch (error) {
      console.error("Invite error:", error);
      setInviteStatus("✗ Error sending invite");
    }
  };

  const handleSocketMessage = async (msg: any) => {
    switch (msg.type) {
      case "connection_established":
        setClientId(msg.clientId);
        setCurrentUser(prev => ({
          ...prev,
          username: msg.username,
          avatar: msg.avatar
        }));

        // Load history
        if (msg.history && msg.history.length > 0) {
          setElements(msg.history);
        } else {
          // Check if template needed
          const token = localStorage.getItem("auth_token");
          if (token && slug) {
            try {
              const res = await fetch(`http://localhost:5000/api/dashboards/${slug}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const dashboard = await res.json();
              let type = "blank";
              const desc = dashboard.description?.toLowerCase() || "";
              if (desc.includes("kanban")) type = "kanban";
              else if (desc.includes("brainstorm")) type = "brainstorm";
              else if (desc.includes("flowchart")) type = "flowchart";
              else if (desc.includes("mindmap")) type = "mindmap";

              if (type !== "blank") {
                const templateElements = generateTemplate(type);
                setElements(templateElements);
                socketRef.current?.send(JSON.stringify({
                  type: "batch_draw_action",
                  elements: templateElements
                }));
              }
            } catch (e) {
              console.error("Template init failed", e);
            }
          }
        }

        // Load chat messages
        if (msg.chatMessages) {
          setChatMessages(msg.chatMessages);
        }

        // Load activities
        if (msg.activities) {
          setActivities(msg.activities);
        }

        // Load presence
        if (msg.presence) {
          setRemoteCursors(msg.presence.filter((p: any) => p.userId !== msg.userId));
        }
        break;

      case "draw_action":
        setElements(prev => {
          if (prev.find(e => e.id === msg.element.id)) return prev;
          return [...prev, msg.element];
        });
        if (msg.username && msg.username !== currentUser.username) {
          addNotification("update", `${msg.username} added a ${msg.element.type}`);
        }
        break;

      case "batch_draw_action":
        setElements(prev => {
          const newElements = msg.elements.filter((e: DrawElement) =>
            !prev.find(existing => existing.id === e.id)
          );
          return [...prev, ...newElements];
        });
        break;

      case "element_update":
        setElements(prev => prev.map(el =>
          el.id === msg.element.id ? msg.element : el
        ));
        break;

      case "element_comment_added":
        setElements(prev => prev.map(el => {
          if (el.id === msg.elementId) {
            return {
              ...el,
              comments: [...(el.comments || []), msg.comment]
            };
          }
          return el;
        }));
        addNotification("comment", `${msg.comment.username} commented on an element`);
        break;

      case "element_reaction":
        setElements(prev => prev.map(el => {
          if (el.id === msg.elementId) {
            return {
              ...el,
              reactions: [...(el.reactions || []), msg.reaction]
            };
          }
          return el;
        }));
        break;

      case "clear_board":
        setElements([]);
        break;

      case "cursor_move":
        setRemoteCursors(prev => {
          const others = prev.filter(c => c.clientId !== msg.clientId);
          if (msg.clientId === clientId) return others;
          return [
            ...others,
            {
              clientId: msg.clientId,
              x: msg.x,
              y: msg.y,
              color: msg.color,
              username: msg.username,
              avatar: msg.avatar || `https://ui-avatars.com/api/?name=${msg.username}`,
              status: msg.status || "online",
              role: msg.role || "editor"
            }
          ];
        });
        break;

      case "user_left":
        setRemoteCursors(prev => prev.filter(c => c.clientId !== msg.clientId));
        if (msg.activity) {
          setActivities(prev => [msg.activity, ...prev].slice(0, 50));
        }
        break;

      case "user_joined":
        if (msg.activity) {
          setActivities(prev => [msg.activity, ...prev].slice(0, 50));
        }
        addNotification("invite", `${msg.username} joined the board`);
        break;

      case "chat_message":
        setChatMessages(prev => [...prev, msg.message]);
        break;

      case "typing_indicator":
        if (msg.isTyping) {
          setTypingUsers(prev => [...new Set([...prev, msg.username])]);
        } else {
          setTypingUsers(prev => prev.filter(u => u !== msg.username));
        }
        break;

      case "activity":
        setActivities(prev => [msg.activity, ...prev].slice(0, 50));
        break;

      case "presence_update":
        setRemoteCursors(prev => prev.map(c =>
          c.clientId === msg.clientId ? { ...c, status: msg.status } : c
        ));
        break;
    }
  };

  // Drawing functions
  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawElement) => {
    if (element.id === editingTextId) return;

    ctx.globalAlpha = (element.opacity || 100) / 100;
    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.fillColor;
    ctx.lineWidth = element.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (element.type) {
      case "rectangle":
        if (element.endPoint) {
          const x = Math.min(element.startPoint.x, element.endPoint.x);
          const y = Math.min(element.startPoint.y, element.endPoint.y);
          const w = Math.abs(element.endPoint.x - element.startPoint.x);
          const h = Math.abs(element.endPoint.y - element.startPoint.y);
          if (element.fillColor !== "transparent") ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
        }
        break;

      case "circle":
        if (element.endPoint) {
          const rX = Math.abs(element.endPoint.x - element.startPoint.x);
          const rY = Math.abs(element.endPoint.y - element.startPoint.y);
          const r = Math.sqrt(rX * rX + rY * rY);
          ctx.beginPath();
          ctx.arc(element.startPoint.x, element.startPoint.y, r, 0, 2 * Math.PI);
          if (element.fillColor !== "transparent") ctx.fill();
          ctx.stroke();
        }
        break;

      case "line":
      case "arrow":
        if (element.endPoint) {
          ctx.beginPath();
          ctx.moveTo(element.startPoint.x, element.startPoint.y);
          ctx.lineTo(element.endPoint.x, element.endPoint.y);
          ctx.stroke();
          if (element.type === "arrow") {
            drawArrowHead(ctx, element.startPoint, element.endPoint, element.strokeWidth);
          }
        }
        break;

      case "draw":
        if (element.points && element.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          for (let i = 1; i < element.points.length; i++) {
            ctx.lineTo(element.points[i].x, element.points[i].y);
          }
          ctx.stroke();
        }
        break;

      case "text":
        if (element.text) {
          ctx.font = `${element.strokeWidth * 8 + 10}px Arial`;
          ctx.fillStyle = element.color;
          ctx.fillText(element.text, element.startPoint.x, element.startPoint.y);
        }
        break;

      case "sticky":
        if (element.endPoint) {
          const x = element.startPoint.x;
          const y = element.startPoint.y;
          const w = Math.abs(element.endPoint.x - element.startPoint.x);
          const h = Math.abs(element.endPoint.y - element.startPoint.y);
          ctx.fillStyle = element.fillColor || "#ffeaa7";
          ctx.fillRect(x, y, w, h);
          ctx.strokeStyle = "rgba(0,0,0,0.1)";
          ctx.strokeRect(x, y, w, h);
          if (element.text) {
            ctx.fillStyle = "#000";
            ctx.font = "14px Arial";
            ctx.fillText(element.text, x + 10, y + 30);
          }
        }
        break;
    }

    // Draw comment indicator
    if (element.comments && element.comments.length > 0) {
      ctx.save();
      ctx.fillStyle = "#FF5733";
      ctx.font = "bold 10px Arial";
      const badge = element.comments.length.toString();
      const bx = element.startPoint.x + (element.endPoint ? Math.abs(element.endPoint.x - element.startPoint.x) : 20) - 15;
      const by = element.startPoint.y - 8;
      ctx.beginPath();
      ctx.arc(bx, by, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillText(badge, bx - 3, by + 3);
      ctx.restore();
    }

    // Draw reactions
    if (element.reactions && element.reactions.length > 0) {
      const uniqueReactions = element.reactions.reduce((acc: any, r: Reaction) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
      }, {});

      ctx.save();
      ctx.font = "14px Arial";
      let offsetX = 0;
      Object.entries(uniqueReactions).forEach(([emoji, count]: [string, any]) => {
        const rx = element.startPoint.x + offsetX;
        const ry = element.startPoint.y + (element.endPoint ? Math.abs(element.endPoint.y - element.startPoint.y) : 20) + 5;
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(rx, ry, 30, 20);
        ctx.fillText(`${emoji} ${count}`, rx + 2, ry + 14);
        offsetX += 35;
      });
      ctx.restore();
    }

    ctx.globalAlpha = 1;
  };

  const drawArrowHead = (
    ctx: CanvasRenderingContext2D,
    from: Point,
    to: Point,
    strokeWidth: number
  ) => {
    const headLength = strokeWidth * 5 + 10;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headLength * Math.cos(angle - Math.PI / 6),
      to.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headLength * Math.cos(angle + Math.PI / 6),
      to.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  const drawResizeHandles = (ctx: CanvasRenderingContext2D, element: DrawElement) => {
    if (!element.endPoint) return;
    const minX = Math.min(element.startPoint.x, element.endPoint.x);
    const maxX = Math.max(element.startPoint.x, element.endPoint.x);
    const minY = Math.min(element.startPoint.y, element.endPoint.y);
    const maxY = Math.max(element.startPoint.y, element.endPoint.y);

    ctx.strokeStyle = "#4299e1";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    ctx.setLineDash([]);

    const handleSize = 8;
    const handles = [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: minX, y: maxY },
      { x: maxX, y: maxY }
    ];
    ctx.fillStyle = "#4299e1";
    handles.forEach(h => {
      ctx.fillRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
    });
  };

  const drawRemoteCursor = (ctx: CanvasRenderingContext2D, cursor: RemoteCursor) => {
    ctx.save();
    ctx.fillStyle = cursor.color || "#f00";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(cursor.x, cursor.y);
    ctx.lineTo(cursor.x + 6, cursor.y + 18);
    ctx.lineTo(cursor.x + 10, cursor.y + 10);
    ctx.lineTo(cursor.x + 18, cursor.y + 6);
    ctx.closePath();
    ctx.fill();

    const name = cursor.username || "User";
    ctx.font = "bold 11px Sans-Serif";
    const textWidth = ctx.measureText(name).width;
    ctx.fillStyle = cursor.color || "#f00";
    ctx.fillRect(cursor.x + 12, cursor.y + 12, textWidth + 8, 18);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(name, cursor.x + 16, cursor.y + 24);
    ctx.restore();
  };

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = zoom / 100;
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(scale, scale);

    elements.forEach(element => {
      drawElement(ctx, element);
      if (element.id === selectedElementId && element.id !== editingTextId) {
        drawResizeHandles(ctx, element);
      }
    });

    if (currentElement) drawElement(ctx, currentElement);
    remoteCursors.forEach(cursor => drawRemoteCursor(ctx, cursor));
    ctx.restore();
  }, [elements, currentElement, zoom, panOffset, selectedElementId, editingTextId, remoteCursors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      redrawCanvas();
    }
  }, [redrawCanvas]);

  // Mouse Handlers
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scale = zoom / 100;
    let x = (e.clientX - rect.left - panOffset.x) / scale;
    let y = (e.clientY - rect.top - panOffset.y) / scale;

    if (gridSnap) {
      const gridSize = 20;
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

    return { x, y };
  };

  const getElementAtPoint = (point: Point): DrawElement | null => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (el.endPoint) {
        const minX = Math.min(el.startPoint.x, el.endPoint.x);
        const maxX = Math.max(el.startPoint.x, el.endPoint.x);
        const minY = Math.min(el.startPoint.y, el.endPoint.y);
        const maxY = Math.max(el.startPoint.y, el.endPoint.y);
        if (point.x >= minX - 5 && point.x <= maxX + 5 && point.y >= minY - 5 && point.y <= maxY + 5) {
          return el;
        }
      }
    }
    return null;
  };

  const startTextEditing = (el: DrawElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = zoom / 100;
    const x = rect.left + (el.startPoint.x * scale + panOffset.x);
    const y = rect.top + (el.startPoint.y * scale + panOffset.y);
    setEditingTextId(el.id);
    setEditingText(el.text || "");
    setTextInputPos({ x, y });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePos(e);

    if (e.button === 1 || selectedTool === "hand") {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (selectedTool === "select") {
      const clicked = getElementAtPoint(point);
      if (clicked) {
        if (clicked.locked) return;
        setSelectedElementId(clicked.id);
        if (clicked.type === "text" || clicked.type === "sticky") {
          startTextEditing(clicked);
          return;
        }
        setIsDragging(true);
        setDragStart(point);
      } else {
        setSelectedElementId(null);
      }
      return;
    }

    setStartPoint(point);
    setIsDrawing(true);

    if (selectedTool === "text" || selectedTool === "sticky") {
      const newEl: DrawElement = {
        id: Date.now().toString(),
        type: selectedTool,
        startPoint: point,
        endPoint: selectedTool === "sticky" ? { x: point.x + 150, y: point.y + 150 } : undefined,
        color: strokeColor,
        fillColor: selectedTool === "sticky" && fillColor === "transparent" ? "#ffeaa7" : fillColor,
        strokeWidth,
        text: "",
        opacity,
        createdBy: clientId,
        createdAt: Date.now()
      };
      setElements(prev => [...prev, newEl]);
      socketRef.current?.send(JSON.stringify({
        type: "draw_action",
        element: newEl
      }));
      startTextEditing(newEl);
      return;
    }

    setCurrentElement({
      id: Date.now().toString(),
      type: selectedTool,
      startPoint: point,
      color: strokeColor,
      fillColor,
      strokeWidth,
      points: selectedTool === "draw" ? [point] : undefined,
      opacity,
      createdBy: clientId,
      createdAt: Date.now()
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const now = Date.now();
    if (socketRef.current?.readyState === WebSocket.OPEN && now - lastCursorUpdate.current > 50) {
      const rp = getMousePos(e);
      socketRef.current.send(JSON.stringify({
        type: "cursor_move",
        x: rp.x,
        y: rp.y,
        color: userColor,
        username: currentUser.username,
        avatar: currentUser.avatar,
        status: currentUser.status,
        role: currentUser.role
      }));
      lastCursorUpdate.current = now;
    }

    if (isPanning && lastPanPoint) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      setPanOffset(p => ({ x: p.x + dx, y: p.y + dy }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    const point = getMousePos(e);

    if (isDragging && selectedElementId && dragStart) {
      const dx = point.x - dragStart.x;
      const dy = point.y - dragStart.y;
      const updated = elements.map(el => {
        if (el.id === selectedElementId && !el.locked) {
          const u = {
            ...el,
            startPoint: { x: el.startPoint.x + dx, y: el.startPoint.y + dy },
            endPoint: el.endPoint
              ? { x: el.endPoint.x + dx, y: el.endPoint.y + dy }
              : undefined,
            points: el.points?.map(p => ({ x: p.x + dx, y: p.y + dy }))
          };
          socketRef.current?.send(JSON.stringify({ type: "element_update", element: u }));
          return u;
        }
        return el;
      });
      setElements(updated);
      setDragStart(point);
      return;
    }

    if (!isDrawing || !startPoint) return;

    if (selectedTool === "draw") {
      setCurrentElement(c => c ? ({ ...c, points: [...(c.points || []), point] }) : null);
    } else {
      setCurrentElement(c => c ? ({ ...c, endPoint: point }) : null);
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      setLastPanPoint(null);
      return;
    }

    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      addToHistory(elements);
      return;
    }

    if (currentElement) {
      setElements(prev => [...prev, currentElement!]);
      socketRef.current?.send(JSON.stringify({
        type: "draw_action",
        element: currentElement
      }));
      addToHistory([...elements, currentElement]);
      setCurrentElement(null);
    }

    setIsDrawing(false);
    setStartPoint(null);
  };

  // Text Editing
  const finishTextEditing = () => {
    if (!editingTextId) return;
    const updated = elements.map(el => {
      if (el.id === editingTextId) {
        const u = { ...el, text: editingText };
        socketRef.current?.send(JSON.stringify({ type: "element_update", element: u }));
        return u;
      }
      return el;
    });
    setElements(updated);
    addToHistory(updated);
    setEditingTextId(null);
    setEditingText("");
  };

  // Tools
  const handleClear = () => {
    setElements([]);
    setHistory([[]]);
    socketRef.current?.send(JSON.stringify({ type: "clear_board" }));
  };

  const handleExport = () => {
    const link = document.createElement("a");
    link.download = `${slug || "board"}.png`;
    link.href = canvasRef.current?.toDataURL() || "";
    link.click();
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(h => h - 1);
      setElements(history[historyStep - 1]);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(h => h + 1);
      setElements(history[historyStep + 1]);
    }
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + 10, 400));
  const handleZoomOut = () => setZoom(z => Math.max(z - 10, 25));

  const handleDuplicate = () => {
    if (!selectedElementId) return;
    const el = elements.find(e => e.id === selectedElementId);
    if (!el) return;

    const duplicated: DrawElement = {
      ...el,
      id: Date.now().toString(),
      startPoint: { x: el.startPoint.x + 20, y: el.startPoint.y + 20 },
      endPoint: el.endPoint
        ? { x: el.endPoint.x + 20, y: el.endPoint.y + 20 }
        : undefined,
      createdBy: clientId,
      createdAt: Date.now()
    };

    setElements(prev => [...prev, duplicated]);
    socketRef.current?.send(JSON.stringify({
      type: "draw_action",
      element: duplicated
    }));
    setSelectedElementId(duplicated.id);
  };

  const handleLockElement = () => {
    if (!selectedElementId) return;
    const updated = elements.map(el => {
      if (el.id === selectedElementId) {
        const u = { ...el, locked: !el.locked };
        socketRef.current?.send(JSON.stringify({ type: "element_update", element: u }));
        return u;
      }
      return el;
    });
    setElements(updated);
  };

  const handleDelete = () => {
    if (!selectedElementId) return;
    const updated = elements.filter(el => el.id !== selectedElementId);
    setElements(updated);
    addToHistory(updated);
    setSelectedElementId(null);
  };

  const tools = [
    { id: "select", icon: FiMousePointer, label: "Select", shortcut: "V" },
    { id: "hand", icon: FiMove, label: "Pan", shortcut: "H" },
    { id: "rectangle", icon: FiSquare, label: "Rect", shortcut: "R" },
    { id: "circle", icon: FiCircle, label: "Circle", shortcut: "O" },
    { id: "arrow", icon: FiArrowRight, label: "Arrow", shortcut: "A" },
    { id: "line", icon: FiMinus, label: "Line", shortcut: "L" },
    { id: "draw", icon: FiEdit3, label: "Draw", shortcut: "P" },
    { id: "text", icon: FiType, label: "Text", shortcut: "T" },
    { id: "sticky", icon: FiFileText, label: "Sticky", shortcut: "S" }
  ];

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingTextId || chatInput) return;

      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        handleDuplicate();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElementId) {
          e.preventDefault();
          handleDelete();
        }
      }
      if (e.key === "?") {
        setShowShortcuts(true);
      }
      if (e.key === "Escape") {
        setSelectedElementId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingTextId, selectedElementId, history, historyStep, chatInput]);

  const getBackgroundPattern = () => {
    switch (bgPattern) {
      case "grid":
        return {
          backgroundImage:
            `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),` +
            ` linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "20px 20px"
        };
      case "dots":
        return {
          backgroundImage:
            `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px"
        };
      case "lines":
        return {
          backgroundImage:
            `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "20px 20px"
        };
      default:
        return {};
    }
  };

  const themeColors =
    theme === "dark"
      ? { bg: "#0c0c0f", card: "#141418", text: "text-gray-200", border: "border-white/10" }
      : { bg: "#f5f5f5", card: "#ffffff", text: "text-gray-800", border: "border-gray-300" };

  return (
    <div
      className={`h-screen ${theme === "dark" ? "bg-[#0c0c0f]" : "bg-gray-100"} ${themeColors.text} flex flex-col overflow-hidden relative`}
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Video Call Overlay */}
      {showVideoCall && (
        <div
          className={`absolute top-20 right-4 z-[60] flex flex-col gap-2 p-3 bg-[${themeColors.card}]/95 backdrop-blur-md border ${themeColors.border} rounded-xl shadow-2xl max-h-[80vh] overflow-y-auto w-64`}
        >
          <div className={`flex justify-between items-center pb-2 border-b ${themeColors.border}`}>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <FiVideo className="text-indigo-500" />
              Video Call
            </h3>
            <button
              onClick={() => setShowVideoCall(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <FiX />
            </button>
          </div>

          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-white/10">
            <video
              ref={el => {
                if (el) el.srcObject = localVideoStreamRef.current;
              }}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            <span className="absolute bottom-2 left-2 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">
              You
            </span>
          </div>

          {remoteVideoStreams.map((s) => (
            <div
              key={s.clientId}
              className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-white/10"
            >
              <video
                ref={el => {
                  if (el) el.srcObject = s.stream;
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">
                {s.username}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header
        className={`flex items-center justify-between px-4 py-3 border-b ${themeColors.border} bg-[${themeColors.card}]/95 backdrop-blur-xl z-50`}
      >
        <div className="flex items-center gap-4">
          <Link href="/workspace">
            <button className="p-2 rounded-lg hover:bg-white/5 transition">
              <FiArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
          </Link>

          <div className="flex items-center gap-2">
            <img
              src={currentUser.avatar}
              alt=""
              className="w-8 h-8 rounded-full border-2 border-indigo-500"
            />
            <div>
              <span className={`text-lg font-semibold ${themeColors.text}`}>
                {slug || "Untitled Board"}
              </span>
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentUser.status === "online"
                      ? "bg-emerald-500"
                      : currentUser.status === "busy"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                />
                <span className="text-xs text-gray-400 capitalize">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
            className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
            title="Toggle Theme"
          >
            {theme === "dark" ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white relative"
            title="Notifications"
          >
            <FiBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Activity Feed */}
          <button
            onClick={() => setShowActivityFeed(!showActivityFeed)}
            className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
            title="Activity Feed"
          >
            <FiActivity size={18} />
          </button>

          {/* Chat */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
            title="Chat"
          >
            <FiMessageCircle size={18} />
          </button>

          {/* Timeline */}
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
            title="Timeline"
          >
            <FiClock size={18} />
          </button>

          <button
            onClick={toggleMic}
            className={`p-2 rounded-lg transition ${
              isMicOn ? "bg-green-500/20 text-green-400" : "hover:bg-white/10 text-gray-400"
            }`}
            title="Voice"
          >
            {isMicOn ? <FiMic size={18} /> : <FiMicOff size={18} />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-2 rounded-lg transition ${
              isVideoOn ? "bg-red-500/20 text-red-500" : "hover:bg-white/10 text-gray-400"
            }`}
            title="Video"
          >
            {isVideoOn ? <FiVideo size={18} /> : <FiVideoOff size={18} />}
          </button>

          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white relative"
            title="Participants"
          >
            <FiUsers size={18} />
            {remoteCursors.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full text-[10px] flex items-center justify-center font-bold">
                {remoteCursors.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition flex items-center gap-2"
          >
            <FiUserPlus size={16} />
            Invite
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition flex items-center gap-2"
          >
            <FiShare2 size={16} />
            Share
          </button>
        </div>
      </header>

      {/* Chat Panel */}
      {showChat && (
        <div
          className={`absolute top-20 right-4 z-[60] w-80 h-[500px] bg-[${themeColors.card}]/95 backdrop-blur-md border ${themeColors.border} rounded-xl shadow-2xl flex flex-col`}
        >
          <div className={`flex justify-between items-center p-4 border-b ${themeColors.border}`}>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <FiMessageCircle className="text-indigo-500" />
              Chat
            </h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <FiX />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2">
                <img
                  src={msg.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold text-sm ${themeColors.text}`}>
                      {msg.username}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className={`text-sm ${themeColors.text} break-words`}>
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
            {typingUsers.length > 0 && (
              <div className="text-xs text-gray-400 italic flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className={`p-4 border-t ${themeColors.border}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => handleChatTyping(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                placeholder="Type a message..."
                className={`flex-1 rounded-lg bg-[${themeColors.bg}] border ${themeColors.border} text-sm ${themeColors.text} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              <button
                onClick={sendChatMessage}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-semibold transition flex items-center gap-2"
              >
                <FiSend size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Feed */}
      {showActivityFeed && (
        <div
          className={`absolute top-20 left-4 z-[60] w-80 max-h-[500px] bg-[${themeColors.card}]/95 backdrop-blur-md border ${themeColors.border} rounded-xl shadow-2xl overflow-hidden flex flex-col`}
        >
          <div className={`flex justify-between items-center p-4 border-b ${themeColors.border}`}>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <FiActivity className="text-indigo-500" />
              Activity Feed
            </h3>
            <button
              onClick={() => setShowActivityFeed(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <FiX />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition"
              >
                <img
                  src={activity.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${themeColors.text}`}>
                    <span className="font-semibold">{activity.username}</span>{" "}
                    {activity.action}{" "}
                    <span className="text-gray-400">{activity.details}</span>
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <span className="text-xs flex-shrink-0">
                  {activity.type === "create" && <FiPlus className="text-green-500" />}
                  {activity.type === "update" && <FiEdit3 className="text-blue-500" />}
                  {activity.type === "delete" && <FiTrash2 className="text-red-500" />}
                  {activity.type === "invite" && <FiMail className="text-purple-500" />}
                  {activity.type === "join" && <FiUsers className="text-indigo-500" />}
                  {activity.type === "comment" && <FiMessageSquare className="text-yellow-500" />}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div
          className={`absolute top-20 right-80 z-[60] w-80 max-h-[400px] bg-[${themeColors.card}]/95 backdrop-blur-md border ${themeColors.border} rounded-xl shadow-2xl overflow-hidden flex flex-col`}
        >
          <div className={`flex justify-between items-center p-4 border-b ${themeColors.border}`}>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <FiBell className="text-indigo-500" />
              Notifications
            </h3>
            <button
              onClick={() => {
                setShowNotifications(false);
                setUnreadCount(0);
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              }}
              className="text-gray-400 hover:text-white transition"
            >
              <FiX />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-lg ${
                  !notif.read
                    ? "bg-indigo-500/10 border border-indigo-500/30"
                    : "bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">
                    {notif.type === "mention" && <FiMessageCircle className="text-blue-400" />}
                    {notif.type === "comment" && <FiMessageSquare className="text-yellow-400" />}
                    {notif.type === "update" && <FiEdit3 className="text-green-400" />}
                    {notif.type === "invite" && <FiMail className="text-purple-400" />}
                  </span>
                  <p className={`text-sm flex-1 ${themeColors.text}`}>{notif.message}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(notif.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {showTimeline && (
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-[60] max-w-4xl w-full bg-[${themeColors.card}]/95 backdrop-blur-md border ${themeColors.border} rounded-xl shadow-2xl p-4`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <FiClock className="text-indigo-500" />
              Timeline View
            </h3>
            <button
              onClick={() => setShowTimeline(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <FiX />
            </button>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500" />
            <div className="space-y-4 pl-8">
              {activities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="relative">
                  <div
                    className={`absolute -left-8 w-4 h-4 rounded-full bg-indigo-500 border-4 border-[${themeColors.card}]`}
                  />
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={activity.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                      <span className={`font-semibold text-sm ${themeColors.text}`}>
                        {activity.username}
                      </span>
                      <span className={`text-sm ${themeColors.text}`}>
                        {activity.action}
                      </span>
                      <span className="text-sm text-gray-400">
                        {activity.details}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className={`bg-[${themeColors.card}] rounded-xl max-w-md w-full p-6 space-y-6 border ${themeColors.border}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className={`text-xl font-semibold ${themeColors.text} flex items-center gap-2`}
            >
              <FiUserPlus className="text-indigo-500" />
              Invite User to Board
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${themeColors.text} mb-2`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInviteUser()}
                  placeholder="user@example.com"
                  className={`w-full rounded-lg bg-[${themeColors.bg}] border ${themeColors.border} text-sm ${themeColors.text} px-4 py-3 focus:outline-nonefocus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              {inviteStatus && (
                <div
                  className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                    inviteStatus.includes("✓")
                      ? "bg-green-500/10 text-green-400 border border-green-500/30"
                      : "bg-red-500/10 text-red-400 border border-red-500/30"
                  }`}
                >
                  {inviteStatus.includes("✓") ? <FiCheckCircle /> : <FiAlertCircle />}
                  {inviteStatus}
                </div>
              )}

              {invitedUsers.length > 0 && (
                <div>
                  <p
                    className={`text-sm font-medium ${themeColors.text} mb-2`}
                  >
                    Invited Users:
                  </p>
                  <div className="space-y-1">
                    {invitedUsers.map((email, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 p-2 rounded-lg bg-white/5 text-sm ${themeColors.text}`}
                      >
                        <FiMail className="text-indigo-400" />
                        <span>{email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteUser}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm text-white font-semibold transition flex items-center gap-2"
              >
                <FiSend size={16} />
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className={`bg-[${themeColors.card}] rounded-xl max-w-md w-full p-6 space-y-6 border ${themeColors.border}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className={`text-xl font-semibold ${themeColors.text} flex items-center gap-2`}
            >
              <FiShare2 className="text-indigo-500" />
              Share Board
            </h2>
            <div className="flex gap-2">
              <input
                readOnly
                type="text"
                value={shareUrl}
                className={`flex-1 rounded-lg bg-[${themeColors.bg}] border ${themeColors.border} text-sm ${themeColors.text} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setCopySuccess("Copied!");
                  setTimeout(() => setCopySuccess(""), 2000);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm text-white font-semibold transition flex items-center gap-2"
              >
                <FiCopy size={16} />
                {copySuccess || "Copy"}
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className={`bg-[${themeColors.card}] rounded-xl max-w-md w-full p-6 space-y-4 border ${themeColors.border}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className={`text-xl font-semibold ${themeColors.text} mb-4 flex items-center gap-2`}
            >
              <FiHelpCircle className="text-indigo-500" />
              Keyboard Shortcuts
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Undo</span>
                <kbd className="bg-white/10 px-2 py-1 rounded text-xs">
                  Ctrl/Cmd + Z
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Redo</span>
                <kbd className="bg-white/10 px-2 py-1 rounded text-xs">
                  Ctrl/Cmd + Y
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duplicate</span>
                <kbd className="bg-white/10 px-2 py-1 rounded text-xs">
                  Ctrl/Cmd + D
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Delete</span>
                <kbd className="bg-white/10 px-2 py-1 rounded text-xs">
                  Delete/Backspace
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Deselect</span>
                <kbd className="bg-white/10 px-2 py-1 rounded text-xs">
                  Esc
                </kbd>
              </div>
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="w-full mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Participants Panel */}
      {showParticipants && (
        <div
          className={`absolute top-20 right-4 z-[60] w-64 bg-[${themeColors.card}]/95 backdrop-blur-md border ${themeColors.border} rounded-xl shadow-2xl p-4`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <FiUsers className="text-indigo-500" />
              Participants ({remoteCursors.length + 1})
            </h3>
            <button
              onClick={() => setShowParticipants(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <FiX />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
              <img
                src={currentUser.avatar}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <span className={`text-sm font-semibold ${themeColors.text}`}>
                  You (Host)
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-400 capitalize">
                    {currentUser.status}
                  </span>
                </div>
              </div>
            </div>
            {remoteCursors.map((cursor) => (
              <div
                key={cursor.clientId}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition"
              >
                <img
                  src={cursor.avatar}
                  alt=""
                  className="w-8 h-8 rounded-full"
                  style={{ borderColor: cursor.color, borderWidth: 2 }}
                />
                <div className="flex-1">
                  <span className={`text-sm ${themeColors.text}`}>
                    {cursor.username}
                  </span>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          cursor.status === "online"
                            ? "#10b981"
                            : cursor.status === "busy"
                            ? "#ef4444"
                            : "#f59e0b"
                      }}
                    />
                    <span className="text-xs text-gray-400 capitalize">
                      {cursor.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      • {cursor.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layers Panel */}
      {showLayers && (
        <div
          className={`absolute bottom-20 right-4 z-[60] w-64 max-h-96 overflow-y-auto bg-[${themeColors.card}]/95 backdrop-blur-md border ${themeColors.border} rounded-xl shadow-2xl p-4`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <FiLayers className="text-indigo-500" />
              Layers ({elements.length})
            </h3>
            <button
              onClick={() => setShowLayers(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <FiX />
            </button>
          </div>
          <div className="space-y-1">
            {elements
              .slice()
              .reverse()
              .map((el) => {
                const Tool = tools.find(t => t.id === el.type)?.icon || FiSquare;
                return (
                  <div
                    key={el.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                      selectedElementId === el.id
                        ? "bg-indigo-500/20 border border-indigo-500"
                        : "hover:bg-white/5"
                    }`}
                    onClick={() => setSelectedElementId(el.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Tool size={16} />
                      <span
                        className={`text-xs ${themeColors.text} capitalize`}
                      >
                        {el.type}
                      </span>
                    </div>
                    {el.locked && (
                      <FiLock size={12} className="text-gray-400" />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Text Editor */}
      {editingTextId && (
        <textarea
          autoFocus
          value={editingText}
          onChange={e => setEditingText(e.target.value)}
          onBlur={finishTextEditing}
          onKeyDown={e => {
            if (e.key === "Escape") finishTextEditing();
          }}
          style={{
            position: "fixed",
            left: textInputPos.x,
            top: textInputPos.y,
            fontSize: `${strokeWidth * 8 + 10}px`,
            color: strokeColor,
            zIndex: 1000
          }}
          className={`rounded-lg p-2 outline-none resize-none bg-[${themeColors.bg}]/90 backdrop-blur-sm border border-indigo-500 shadow-lg`}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <aside
          className={`w-16 border-r ${themeColors.border} bg-[${themeColors.card}]/50 flex flex-col items-center py-4 gap-2`}
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  selectedTool === tool.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                title={`${tool.label} (${tool.shortcut})`}
              >
                <Icon size={18} />
              </button>
            );
          })}

          <div className="h-px w-8 bg-white/10 my-2" />

          <button
            onClick={handleClear}
            className="w-10 h-10 rounded-lg hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition"
            title="Clear"
          >
            <FiTrash2 size={18} />
          </button>

          <button
            onClick={() => setShowShortcuts(true)}
            className="w-10 h-10 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition"
            title="Shortcuts (?)"
          >
            <FiHelpCircle size={18} />
          </button>
        </aside>

        <main className="flex-1 relative overflow-hidden">
          {/* Top Controls */}
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-[${themeColors.card}]/95 backdrop-blur-xl border ${themeColors.border} rounded-xl p-2 shadow-xl`}
          >
            <input
              type="color"
              value={strokeColor}
              onChange={e => setStrokeColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
              title="Stroke Color"
            />

            <input
              type="color"
              value={fillColor === "transparent" ? "#000000" : fillColor}
              onChange={e => setFillColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
              title="Fill Color"
            />

            <button
              onClick={() => setFillColor("transparent")}
              className={`w-6 h-6 rounded border transition ${
                fillColor === "transparent"
                  ? "border-red-500 bg-red-500/20"
                  : "border-gray-500 hover:border-red-500"
              }`}
              title="No Fill"
            >
              <FiX size={12} className="mx-auto" />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            {[1, 2, 4, 8].map(w => (
              <button
                key={w}
                onClick={() => setStrokeWidth(w)}
                className={`w-8 h-8 rounded flex items-center justify-center transition ${
                  strokeWidth === w ? "bg-indigo-600" : "hover:bg-white/5"
                }`}
                title={`Stroke Width: ${w}px`}
              >
                <div
                  className="bg-white rounded-full"
                  style={{ width: w * 1.5, height: w * 1.5 }}
                />
              </button>
            ))}

            <div className="w-px h-6 bg-white/10 mx-1" />

            <button
              onClick={handleUndo}
              disabled={historyStep <= 0}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition"
              title="Undo"
            >
              <FiRotateCcw size={18} />
            </button>

            <button
              onClick={handleRedo}
              disabled={historyStep >= history.length - 1}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition"
              title="Redo"
            >
              <FiRotateCw size={18} />
            </button>
          </div>

          {/* Canvas */}
          <div className="w-full h-full relative" style={getBackgroundPattern()}>
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Selected Element Actions */}
          {selectedElementId && (
            <div
              className={`absolute top-4 right-4 z-10 flex gap-1 bg-[${themeColors.card}]/95 backdrop-blur-xl border ${themeColors.border} rounded-xl p-1 shadow-xl`}
            >
              <button
                onClick={() => setShowCommentFor(selectedElementId)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
                title="Comment"
              >
                <FiMessageSquare size={18} />
              </button>

              <button
                onClick={() => addReaction(selectedElementId, "👍")}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
                title="Like"
              >
                <FiThumbsUp size={18} />
              </button>

              <button
                onClick={handleDuplicate}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
                title="Duplicate"
              >
                <FiCopy size={18} />
              </button>

              <button
                onClick={handleLockElement}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
                title={
                  elements.find(e => e.id === selectedElementId)?.locked
                    ? "Unlock"
                    : "Lock"
                }
              >
                {elements.find(e => e.id === selectedElementId)?.locked ? (
                  <FiUnlock size={18} />
                ) : (
                  <FiLock size={18} />
                )}
              </button>

              <button
                onClick={handleDelete}
                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                title="Delete"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          )}

          {/* Comment Input */}
          {showCommentFor && (
            <div
              className={`absolute top-20 right-4 z-10 w-64 bg-[${themeColors.card}]/95 backdrop-blur-xl border ${themeColors.border} rounded-xl p-4 shadow-xl`}
            >
              <h3
                className={`font-bold text-sm ${themeColors.text} mb-2 flex items-center gap-2`}
              >
                <FiMessageSquare className="text-indigo-500" />
                Add Comment
              </h3>

              {/* Show existing comments */}
              <div className="mb-3 max-h-32 overflow-y-auto space-y-2">
                {elements
                  .find(e => e.id === showCommentFor)
                  ?.comments?.map((comment) => (
                    <div
                      key={comment.id}
                      className="text-xs p-2 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <img
                          src={comment.avatar}
                          alt=""
                          className="w-4 h-4 rounded-full"
                        />
                        <span className="font-semibold">
                          {comment.username}
                        </span>
                      </div>
                      <p className={`text-xs ${themeColors.text}`}>
                        {comment.text}
                      </p>
                    </div>
                  ))}
              </div>

              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add your comment..."
                className={`w-full rounded-lg bg-[${themeColors.bg}] border ${themeColors.border} text-sm ${themeColors.text} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={addComment}
                  className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs text-white font-semibold transition flex items-center justify-center gap-1"
                >
                  <FiSend size={12} />
                  Comment
                </button>
                <button
                  onClick={() => {
                    setShowCommentFor(null);
                    setCommentInput("");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Bottom Controls (left) */}
          <div className="absolute bottom-4 left-4 z-10 flex gap-2">
            <div
              className={`flex items-center gap-1 bg-[${themeColors.card}]/95 backdrop-blur-xl border ${themeColors.border} rounded-lg p-1`}
            >
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-gray-400 hover:text-white transition"
                title="Zoom Out"
              >
                <FiZoomOut size={16} />
              </button>
              <span
                className={`text-xs w-12 text-center ${themeColors.text} font-semibold`}
              >
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-gray-400 hover:text-white transition"
                title="Zoom In"
              >
                <FiZoomIn size={16} />
              </button>
            </div>

            <button
              onClick={() =>
                setBgPattern(p =>
                  p === "grid"
                    ? "dots"
                    : p === "dots"
                    ? "lines"
                    : p === "lines"
                    ? "none"
                    : "grid"
                )
              }
              className={`px-3 py-1.5 rounded-lg border bg-[${themeColors.card}]/95 backdrop-blur-xl ${themeColors.border} text-xs ${themeColors.text} hover:text-white capitalize transition flex items-center gap-1`}
              title="Change Background Pattern"
            >
              <FiGrid size={14} />
              {bgPattern}
            </button>

            <button
              onClick={() => setGridSnap(!gridSnap)}
              className={`px-3 py-1.5 rounded-lg border text-xs transition flex items-center gap-1 ${
                gridSnap
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : `bg-[${themeColors.card}]/95 backdrop-blur-xl ${themeColors.border} ${themeColors.text} hover:text-white`
              }`}
              title="Grid Snap"
            >
              <FiMaximize2 size={14} />
              Snap
            </button>
          </div>

          {/* Bottom Controls (right) */}
          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <button
              onClick={() => setShowLayers(!showLayers)}
              className={`px-3 py-1.5 bg-[${themeColors.card}]/95 backdrop-blur-xl border ${themeColors.border} rounded-lg text-xs ${themeColors.text} hover:text-white transition flex items-center gap-1`}
              title="Layers"
            >
              <FiLayers size={14} />
              Layers
            </button>

            <button
              onClick={handleExport}
              className={`px-3 py-1.5 bg-[${themeColors.card}]/95 backdrop-blur-xl border ${themeColors.border} rounded-lg text-xs ${themeColors.text} hover:text-white transition flex items-center gap-1`}
              title="Export as PNG"
            >
              <FiDownload size={14} />
              Export
            </button>
          </div>
        </main>
      </div>

      {/* Stats Badge */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-4 bg-[${themeColors.card}]/95 backdrop-blur-xl border ${themeColors.border} rounded-lg px-4 py-2 text-xs ${themeColors.text} shadow-lg`}
      >
        <span className="flex items-center gap-1">
          <FiUsers size={14} className="text-indigo-400" />
          {remoteCursors.length + 1} online
        </span>
        <span className="flex items-center gap-1">
          <FiLayers size={14} className="text-green-400" />
          {elements.length} elements
        </span>
        <span className="flex items-center gap-1">
          <FiMessageCircle size={14} className="text-blue-400" />
          {chatMessages.length} messages
        </span>
        <span className="flex items-center gap-1">
          <FiActivity size={14} className="text-purple-400" />
          {activities.length} activities
        </span>
        <span className="flex items-center gap-1">
          <FiEye size={14} className="text-yellow-400" />
          {zoom}%
        </span>
      </div>
    </div>
  );
}
