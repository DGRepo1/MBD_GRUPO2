// src/components/Button.jsx
export default function Button({ children, onClick, color = 'blue' }) {
  const base = "px-4 py-2 rounded text-white";
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-600 hover:bg-red-700",
    gray: "bg-gray-400 hover:bg-gray-500"
  };
  return (
    <button onClick={onClick} className={`${base} ${colors[color]}`}>
      {children}
    </button>
  );
}
