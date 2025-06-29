// src/components/Toast.jsx
import { useEffect, useState } from "react";

export default function Toast({ mensaje }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className="flex items-center w-full max-w-xs p-4 text-gray-700 bg-white rounded-lg shadow border-l-4 border-blue-600" role="alert">
        <div className="text-sm font-semibold">{mensaje}</div>
      </div>
    </div>
  );
}
