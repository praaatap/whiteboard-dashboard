"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

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
}

export default function WhiteboardPage({ params }: Props) {
  const [slug, setSlug] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [strokeColor, setStrokeColor] = useState("#ffffff");
  const [fillColor, setFillColor] = useState("transparent");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [showChat, setShowChat] = useState(false);

  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitees, setInvitees] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState("");

  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [textInputPos, setTextInputPos] = useState<Point>({ x: 0, y: 0 });

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);

  const [elements, setElements] = useState<DrawElement[]>([]);
  const [currentElement, setCurrentElement] = useState<DrawElement | null>(null);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [history, setHistory] = useState<DrawElement[][]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Collaboration features
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showBreakoutRooms, setShowBreakoutRooms] = useState(false);
  const [showPolls, setShowPolls] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);

  const tools = [
    { id: "select", icon: "🖱️", label: "Selection", shortcut: "V" },
    { id: "hand", icon: "✋", label: "Pan", shortcut: "H" },
    { id: "rectangle", icon: "▭", label: "Rectangle", shortcut: "R" },
    { id: "circle", icon: "○", label: "Circle", shortcut: "O" },
    { id: "arrow", icon: "→", label: "Arrow", shortcut: "A" },
    { id: "line", icon: "╱", label: "Line", shortcut: "L" },
    { id: "draw", icon: "✏️", label: "Draw", shortcut: "P" },
    { id: "text", icon: "T", label: "Text", shortcut: "T" },
    { id: "sticky", icon: "📝", label: "Sticky Note", shortcut: "S" },
    { id: "eraser", icon: "🧹", label: "Eraser", shortcut: "E" },
  ];

  const colors = ["#ffffff", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dfe6e9", "#a29bfe", "#fd79a8", "#fdcb6e"];

  const activePeople = [
    { name: "You", avatar: "JD", color: "from-indigo-500 to-violet-500" },
    { name: "Sarah Chen", avatar: "SC", color: "from-pink-500 to-rose-500" },
    { name: "Mike Johnson", avatar: "MJ", color: "from-cyan-500 to-blue-500" },
  ];

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    redrawCanvas();
  }, [elements, zoom, panOffset, selectedElementId, currentElement, editingTextId]);

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

    if (currentElement) {
      drawElement(ctx, currentElement);
    }

    ctx.restore();
  }, [elements, currentElement, zoom, panOffset, selectedElementId, editingTextId]);

  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawElement) => {
    if (element.id === editingTextId) return;
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
          const width = Math.abs(element.endPoint.x - element.startPoint.x);
          const height = Math.abs(element.endPoint.y - element.startPoint.y);
          if (element.fillColor !== "transparent") {
            ctx.fillRect(x, y, width, height);
          }
          ctx.strokeRect(x, y, width, height);
        }
        break;

      case "circle":
        if (element.endPoint) {
          const radiusX = Math.abs(element.endPoint.x - element.startPoint.x);
          const radiusY = Math.abs(element.endPoint.y - element.startPoint.y);
          const radius = Math.sqrt(radiusX * radiusX + radiusY * radiusY);
          ctx.beginPath();
          ctx.arc(element.startPoint.x, element.startPoint.y, radius, 0, 2 * Math.PI);
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
          ctx.font = `${element.strokeWidth * 8}px Arial`;
          ctx.fillStyle = element.color;
          ctx.fillText(element.text, element.startPoint.x, element.startPoint.y);
        }
        break;

      case "sticky":
        if (element.endPoint) {
          const x = Math.min(element.startPoint.x, element.endPoint.x);
          const y = Math.min(element.startPoint.y, element.endPoint.y);
          const width = 150;
          const height = 150;
          ctx.fillStyle = element.fillColor || "#ffeaa7";
          ctx.fillRect(x, y, width, height);
          ctx.strokeStyle = "#f0ad4e";
          ctx.strokeRect(x, y, width, height);
          if (element.text) {
            ctx.fillStyle = "#000000";
            ctx.font = "14px Arial";
            const lines = wrapText(ctx, element.text, width - 20);
            lines.forEach((line, i) => {
              ctx.fillText(line, x + 10, y + 30 + i * 20);
            });
          }
        }
        break;
    }
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
      { x: maxX, y: maxY },
    ];

    ctx.fillStyle = "#4299e1";
    handles.forEach(handle => {
      ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
    });
  };

  const drawArrowHead = (ctx: CanvasRenderingContext2D, from: Point, to: Point, strokeWidth: number) => {
    const headLength = strokeWidth * 5;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - headLength * Math.cos(angle - Math.PI / 6), to.y - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - headLength * Math.cos(angle + Math.PI / 6), to.y - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    words.forEach(word => {
      const testLine = currentLine + word + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== "") {
        lines.push(currentLine);
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine);
    return lines;
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scale = zoom / 100;
    return {
      x: (e.clientX - rect.left - panOffset.x) / scale,
      y: (e.clientY - rect.top - panOffset.y) / scale,
    };
  };

  const getElementAtPoint = (point: Point): DrawElement | null => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (isPointInElement(point, element)) return element;
    }
    return null;
  };

  const isPointInElement = (point: Point, element: DrawElement): boolean => {
    if (!element.endPoint) return false;
    const minX = Math.min(element.startPoint.x, element.endPoint.x);
    const maxX = Math.max(element.startPoint.x, element.endPoint.x);
    const minY = Math.min(element.startPoint.y, element.endPoint.y);
    const maxY = Math.max(element.startPoint.y, element.endPoint.y);
    return point.x >= minX - 5 && point.x <= maxX + 5 && point.y >= minY - 5 && point.y <= maxY + 5;
  };

  const getResizeHandle = (point: Point, element: DrawElement): string | null => {
    if (!element.endPoint) return null;
    const minX = Math.min(element.startPoint.x, element.endPoint.x);
    const maxX = Math.max(element.startPoint.x, element.endPoint.x);
    const minY = Math.min(element.startPoint.y, element.endPoint.y);
    const maxY = Math.max(element.startPoint.y, element.endPoint.y);
    const handleSize = 8;
    if (Math.abs(point.x - minX) < handleSize && Math.abs(point.y - minY) < handleSize) return "nw";
    if (Math.abs(point.x - maxX) < handleSize && Math.abs(point.y - minY) < handleSize) return "ne";
    if (Math.abs(point.x - minX) < handleSize && Math.abs(point.y - maxY) < handleSize) return "sw";
    if (Math.abs(point.x - maxX) < handleSize && Math.abs(point.y - maxY) < handleSize) return "se";
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getMousePos(e);

    if (e.button === 1 || selectedTool === "hand") {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (selectedTool === "select") {
      const clickedElement = getElementAtPoint(point);
      if (clickedElement && selectedElementId === clickedElement.id) {
        const handle = getResizeHandle(point, clickedElement);
        if (handle) {
          setResizeHandle(handle);
          setIsDrawing(true);
          setStartPoint(point);
          return;
        }
        if (clickedElement.type === "text" || clickedElement.type === "sticky") {
          startTextEditing(clickedElement);
          return;
        }
        setIsDragging(true);
        setDragStart(point);
        return;
      }
      if (clickedElement) {
        setSelectedElementId(clickedElement.id);
        setIsDragging(true);
        setDragStart(point);
      } else {
        setSelectedElementId(null);
      }
      return;
    }

    setStartPoint(point);
    setIsDrawing(true);

    if (selectedTool === "text") {
      startTextEditing({
        id: Date.now().toString(),
        type: "text",
        startPoint: point,
        color: strokeColor,
        fillColor,
        strokeWidth,
        text: "",
      } as DrawElement);
      return;
    }

    if (selectedTool === "sticky") {
      const newElement: DrawElement = {
        id: Date.now().toString(),
        type: "sticky",
        startPoint: point,
        endPoint: { x: point.x + 150, y: point.y + 150 },
        color: strokeColor,
        fillColor: fillColor === "transparent" ? "#ffeaa7" : fillColor,
        strokeWidth,
        text: "",
      };
      addElement(newElement);
      startTextEditing(newElement);
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
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning && lastPanPoint) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    const point = getMousePos(e);

    if (isDragging && selectedElementId && dragStart) {
      const dx = point.x - dragStart.x;
      const dy = point.y - dragStart.y;
      const updatedElements = elements.map(el => {
        if (el.id === selectedElementId) {
          return {
            ...el,
            startPoint: { x: el.startPoint.x + dx, y: el.startPoint.y + dy },
            endPoint: el.endPoint ? { x: el.endPoint.x + dx, y: el.endPoint.y + dy } : undefined,
            points: el.points ? el.points.map(p => ({ x: p.x + dx, y: p.y + dy })) : undefined,
          };
        }
        return el;
      });
      setElements(updatedElements);
      setDragStart(point);
      return;
    }

    if (!isDrawing || !startPoint) return;

    if (resizeHandle && selectedElementId) {
      const element = elements.find(el => el.id === selectedElementId);
      if (element && element.endPoint) {
        const updatedElements = elements.map(el => {
          if (el.id === selectedElementId) {
            const newElement = { ...el };
            if (resizeHandle === "nw") {
              newElement.startPoint = point;
            } else if (resizeHandle === "ne") {
              newElement.startPoint = { x: el.startPoint.x, y: point.y };
              newElement.endPoint = { x: point.x, y: el.endPoint!.y };
            } else if (resizeHandle === "sw") {
              newElement.startPoint = { x: point.x, y: el.startPoint.y };
              newElement.endPoint = { x: el.endPoint!.x, y: point.y };
            } else if (resizeHandle === "se") {
              newElement.endPoint = point;
            }
            return newElement;
          }
          return el;
        });
        setElements(updatedElements);
      }
      return;
    }

    if (selectedTool === "draw") {
      setCurrentElement({
        ...currentElement!,
        points: [...(currentElement!.points || []), point],
      });
    } else {
      setCurrentElement({
        ...currentElement!,
        endPoint: point,
      });
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
    if (resizeHandle) {
      setResizeHandle(null);
      addToHistory(elements);
    }
    if (currentElement) {
      addElement(currentElement);
      setCurrentElement(null);
    }
    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -10 : 10;
    setZoom(prev => Math.max(25, Math.min(400, prev + delta)));
  };

  const startTextEditing = (element: DrawElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = zoom / 100;
    setEditingTextId(element.id);
    setEditingText(element.text || "");
    setTextInputPos({
      x: rect.left + (element.startPoint.x * scale + panOffset.x),
      y: rect.top + (element.startPoint.y * scale + panOffset.y),
    });
    if (!elements.find(el => el.id === element.id)) {
      setElements([...elements, element]);
    }
  };

  const finishTextEditing = () => {
    if (!editingTextId) return;
    const updatedElements = elements.map(el => {
      if (el.id === editingTextId) {
        return { ...el, text: editingText };
      }
      return el;
    });
    setElements(updatedElements);
    addToHistory(updatedElements);
    setEditingTextId(null);
    setEditingText("");
  };

  const addElement = (element: DrawElement) => {
    const newElements = [...elements, element];
    setElements(newElements);
    addToHistory(newElements);
  };

  const addToHistory = (newElements: DrawElement[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements(history[historyStep - 1] || []);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements(history[historyStep + 1]);
    }
  };

  const handleClear = () => {
    setElements([]);
    setHistory([[]]);
    setHistoryStep(0);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${slug || "whiteboard"}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 400));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 25));
  const handleResetZoom = () => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleAddInvitee = () => {
    if (inviteEmail.trim() !== "" && !invitees.includes(inviteEmail.trim())) {
      setInvitees([...invitees, inviteEmail.trim()]);
      setInviteEmail("");
    }
  };

  const handleRemoveInvitee = (email: string) => {
    setInvitees(invitees.filter(e => e !== email));
  };

  const shareLink = `https://collabboard.app/board/${slug || "untitled"}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  return (
    <div className="h-screen bg-[#0c0c0f] text-gray-200 flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0f0f12]/95 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/5 transition">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <input type="text" defaultValue={slug || "Untitled Board"} className="bg-transparent text-lg font-semibold text-white border-none outline-none focus:bg-white/5 px-2 py-1 rounded" />
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>Auto-saved</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-2 mr-2">
            {activePeople.map((person, index) => (
              <div key={index} className="relative group" title={person.name}>
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${person.color} flex items-center justify-center text-xs font-bold border-2 border-[#0c0c0f] cursor-pointer hover:scale-110 transition-transform`}>
                  {person.avatar}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0c0c0f] bg-emerald-500"></span>
              </div>
            ))}
          </div>
          <button onClick={() => setShowVideoCall(!showVideoCall)} title="Video Call" className="p-2 rounded-lg hover:bg-white/5 transition">🎥</button>
          <button onClick={() => setShowChat(!showChat)} title="Chat" className="p-2 rounded-lg hover:bg-white/5 transition">💬</button>
          <button onClick={() => setShowBreakoutRooms(!showBreakoutRooms)} title="Breakout Rooms" className="p-2 rounded-lg hover:bg-white/5 transition">🔀</button>
          <button onClick={() => setShowPolls(!showPolls)} title="Polls" className="p-2 rounded-lg hover:bg-white/5 transition">📊</button>
          <button onClick={() => setShowTaskManager(!showTaskManager)} title="Tasks" className="p-2 rounded-lg hover:bg-white/5 transition">🗂️</button>
          <button onClick={() => setShowShareModal(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all text-sm flex items-center gap-2">
            Share
          </button>
        </div>
      </header>

      {showVideoCall && (
        <div className="fixed bottom-16 right-4 z-50 w-64 h-48 bg-[#141418] border border-white/20 rounded-lg shadow-lg p-2 text-white">
          <h4 className="text-sm font-semibold mb-2">Video Call (Placeholder)</h4>
          <div className="flex-1 bg-black rounded-md flex items-center justify-center text-gray-500 text-xs h-32">Video feed here</div>
          <button onClick={() => setShowVideoCall(false)} className="mt-2 w-full bg-red-600 rounded py-1 text-center text-white text-xs hover:bg-red-700 transition">End Call</button>
        </div>
      )}

      {showChat && (
        <div className="fixed bottom-16 right-72 z-50 w-80 h-96 bg-[#141418] border border-white/20 rounded-lg shadow-lg p-4 overflow-auto flex flex-col text-white">
          <h4 className="text-sm font-semibold mb-2">Chat (Placeholder)</h4>
          <div className="flex-1 overflow-y-auto mb-2 text-gray-400">Chat messages here...</div>
          <input type="text" placeholder="Type a message..." className="w-full rounded px-2 py-1 text-black" />
        </div>
      )}

      {showBreakoutRooms && (
        <div className="fixed bottom-72 right-4 z-50 w-80 h-48 bg-[#141418] border border-white/20 rounded-lg shadow-lg p-4 text-white">
          <h4 className="mb-2 font-semibold">Breakout Rooms (Placeholder)</h4>
          <div className="text-gray-400">List and join breakout rooms here...</div>
          <button onClick={() => setShowBreakoutRooms(false)} className="mt-2 bg-indigo-600 rounded py-1 w-full hover:bg-indigo-700 transition">Close</button>
        </div>
      )}

      {showPolls && (
        <div className="fixed bottom-72 right-96 z-50 w-64 h-40 bg-[#141418] border border-white/20 rounded-lg shadow-lg p-4 text-white">
          <h4 className="mb-2 font-semibold">Polls (Placeholder)</h4>
          <div className="text-gray-400">Active polls and voting here...</div>
          <button onClick={() => setShowPolls(false)} className="mt-2 bg-indigo-600 rounded py-1 w-full hover:bg-indigo-700 transition">Close</button>
        </div>
      )}

      {showTaskManager && (
        <div className="fixed bottom-72 left-4 z-50 w-80 h-56 bg-[#141418] border border-white/20 rounded-lg shadow-lg p-4 text-white overflow-auto">
          <h4 className="mb-2 font-semibold">Task Manager (Placeholder)</h4>
          <div className="text-gray-400">Shared tasks and to-dos here...</div>
          <button onClick={() => setShowTaskManager(false)} className="mt-2 bg-indigo-600 rounded py-1 w-full hover:bg-indigo-700 transition">Close</button>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#141418] rounded-xl max-w-md w-full p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white">Share your Whiteboard</h2>
            <div>
              <label className="block text-gray-400 mb-2">Shareable Link</label>
              <div className="flex gap-2">
                <input readOnly type="text" value={shareLink} className="flex-1 rounded bg-[#0c0c0f] border border-white/10 text-sm text-gray-300 px-3 py-2" />
                <button onClick={handleCopyLink} className="px-3 py-2 bg-indigo-600 rounded text-sm text-white hover:bg-indigo-700 transition">
                  {copySuccess || "Copy"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Invite by Email</label>
              <div className="flex gap-3">
                <input type="email" placeholder="email@example.com" className="flex-1 rounded bg-[#0c0c0f] border border-white/10 text-sm text-gray-300 px-3 py-2" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddInvitee()} />
                <button onClick={handleAddInvitee} className="px-4 py-2 bg-indigo-600 rounded text-sm text-white hover:bg-indigo-700 transition">Add</button>
              </div>
              <ul className="mt-3 max-h-40 overflow-auto text-gray-300 text-sm">
                {invitees.map(email => (
                  <li key={email} className="flex justify-between items-center mb-1">
                    <span>{email}</span>
                    <button onClick={() => handleRemoveInvitee(email)} className="text-red-500 hover:text-red-400">&times;</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowShareModal(false)} className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20 transition">Close</button>
              <button disabled={invitees.length === 0} onClick={() => { alert("Invites sent!"); setShowShareModal(false); }} className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50">Send Invites</button>
            </div>
          </div>
        </div>
      )}

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
            fontSize: `${strokeWidth * 8}px`,
            color: strokeColor,
            background: "rgba(0,0,0,0.8)",
            border: "2px solid #4299e1",
            outline: "none",
            padding: "8px",
            fontFamily: "Arial",
            resize: "none",
            zIndex: 1000,
            minWidth: "200px",
            minHeight: "40px",
          }}
          className="rounded"
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-16 border-r border-white/10 bg-[#0f0f12]/50 flex flex-col items-center py-4 gap-1">
          {tools.map(tool => (
            <button key={tool.id} onClick={() => setSelectedTool(tool.id)} className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all ${selectedTool === tool.id ? "bg-indigo-600 shadow-lg shadow-indigo-500/30" : "hover:bg-white/5"}`} title={`${tool.label} (${tool.shortcut})`}>
              {tool.icon}
            </button>
          ))}
          <div className="h-px w-10 bg-white/10 my-2"></div>
          <button onClick={handleClear} className="w-12 h-12 rounded-lg hover:bg-white/5 flex items-center justify-center transition-all" title="Clear Canvas">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </aside>

        <main className="flex-1 relative overflow-hidden">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-[#141418] border border-white/10 rounded-xl p-2 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-2 px-3 border-r border-white/10">
              <span className="text-xs text-gray-400">Stroke</span>
              <input type="color" value={strokeColor} onChange={e => setStrokeColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
              <div className="flex gap-1">
                {colors.slice(0, 5).map(color => (
                  <button key={color} onClick={() => setStrokeColor(color)} className="w-6 h-6 rounded border-2 border-white/20 hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 border-r border-white/10">
              <span className="text-xs text-gray-400">Fill</span>
              <input type="color" value={fillColor === "transparent" ? "#000000" : fillColor} onChange={e => setFillColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
              <button onClick={() => setFillColor("transparent")} className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${fillColor === "transparent" ? "border-indigo-500" : "border-white/20"}`} style={{ background: "linear-gradient(45deg, transparent 47%, red 47%, red 53%, transparent 53%)" }} />
            </div>
            <div className="flex items-center gap-2 px-3 border-r border-white/10">
              <span className="text-xs text-gray-400">Width</span>
              <div className="flex gap-1">
                {[1, 2, 4, 8].map(width => (
                  <button key={width} onClick={() => setStrokeWidth(width)} className={`w-8 h-8 rounded flex items-center justify-center ${strokeWidth === width ? "bg-indigo-600" : "hover:bg-white/5"}`}>
                    <div className="bg-white rounded-full" style={{ width: width * 2, height: width * 2 }} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 px-2">
              <button onClick={handleUndo} disabled={historyStep <= 0} className="p-2 rounded hover:bg-white/5 transition disabled:opacity-30" title="Undo">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button onClick={handleRedo} disabled={historyStep >= history.length - 1} className="p-2 rounded hover:bg-white/5 transition disabled:opacity-30" title="Redo">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16h-10a8 8 0 01-8-8V6m18 10l-6-6m6 6l-6 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="w-full h-full relative" style={{ backgroundImage: showGrid ? `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)` : "none", backgroundSize: "20px 20px" }}>
            <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel} />
          </div>

          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#141418] border border-white/10 rounded-lg p-1">
              <button onClick={handleZoomOut} className="p-2 rounded hover:bg-white/5 transition" title="Zoom Out">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
              <button onClick={handleResetZoom} className="px-3 py-1 text-sm text-gray-300 hover:text-white transition min-w-[60px]" title="Reset Zoom">{zoom}%</button>
              <button onClick={handleZoomIn} className="p-2 rounded hover:bg-white/5 transition" title="Zoom In">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
            </div>
            <button onClick={() => setShowGrid(!showGrid)} className={`px-3 py-2 rounded-lg border text-sm transition-all ${showGrid ? "bg-indigo-600 border-indigo-500 text-white" : "bg-[#141418] border-white/10 text-gray-400"}`} title="Toggle Grid">Grid</button>
            <div className="text-xs text-gray-500 bg-[#141418] border border-white/10 rounded-lg px-3 py-2">Elements: {elements.length}</div>
          </div>

          <div className="absolute bottom-4 right-4 z-10">
            <button onClick={handleExport} className="px-4 py-2 rounded-lg bg-[#141418] border border-white/10 text-sm text-gray-300 hover:text-white hover:border-indigo-500/50 transition-all flex items-center gap-2" title="Export PNG">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export PNG
            </button>
          </div>
        </main>

        {showProperties && (
          <aside className="w-64 border-l border-white/10 bg-[#0f0f12]/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Tools Info</h3>
              <button onClick={() => setShowProperties(false)} className="p-1 rounded hover:bg-white/5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-xs text-gray-400">
              <p><strong className="text-white">Selected:</strong> {selectedTool}</p>
              <p><strong className="text-white">Stroke:</strong> {strokeColor}</p>
              <p><strong className="text-white">Width:</strong> {strokeWidth}px</p>
              <p><strong className="text-white">Zoom:</strong> {zoom}%</p>
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-gray-500">Click shapes to select and resize. Double-click text to edit inline. Use scroll wheel to zoom.</p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
