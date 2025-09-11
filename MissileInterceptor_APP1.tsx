import React, { useState, useEffect, useRef } from "react";

export default function App() {
  const canvasRef = useRef(null);
  const [target, setTarget] = useState({ x: 200, y: 200 });
  const [missiles, setMissiles] = useState([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      setTarget((prev) => {
        let { x, y } = prev;
        if (e.key === "ArrowUp") y -= 10;
        if (e.key === "ArrowDown") y += 10;
        if (e.key === "ArrowLeft") x -= 10;
        if (e.key === "ArrowRight") x += 10;
        x = Math.max(0, Math.min(400, x));
        y = Math.max(0, Math.min(400, y));
        return { x, y };
      });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setMissiles((prev) =>
        prev
          .map((m) => {
            const dx = target.x - m.x;
            const dy = target.y - m.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const speed = 3;
            const newX = m.x + (dx / dist) * speed;
            const newY = m.y + (dy / dist) * speed;
            if (Math.hypot(newX - target.x, newY - target.y) < 5) {
              return null;
            }
            return { ...m, x: newX, y: newY };
          })
          .filter(Boolean)
      );
    }, 50);
    return () => clearInterval(id);
  }, [running, target]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "lime";
    ctx.beginPath();
    ctx.arc(target.x, target.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "red";
    missiles.forEach((m) => {
      ctx.beginPath();
      ctx.arc(m.x, m.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [target, missiles]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-xl font-bold mb-4">Missile Intercept Simulator</h1>
      <canvas ref={canvasRef} width={400} height={400} className="border border-gray-700 bg-black" />
      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
          onClick={() => setRunning(true)}
        >
          Start
        </button>
        <button
          className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700"
          onClick={() => setRunning(false)}
        >
          Pause
        </button>
        <button
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
          onClick={() =>
            setMissiles((prev) => [
              ...prev,
              { x: Math.random() * 400, y: Math.random() * 400 }
            ])
          }
        >
          Launch Missile
        </button>
        <button
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
          onClick={() => setMissiles([])}
        >
          Clear Missiles
        </button>
      </div>
      <p className="mt-2 text-sm">Use arrow keys to move the green target.</p>
    </div>
  );
}
