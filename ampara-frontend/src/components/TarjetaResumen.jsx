// src/components/TarjetaResumen.jsx
export default function TarjetaResumen({ titulo, valor, color }) {
  return (
    <div className={`p-5 rounded-lg shadow bg-${color}-50 border-l-4 border-${color}-600`}>
      <h3 className={`text-${color}-800 text-sm font-semibold mb-1`}>{titulo}</h3>
      <p className="text-2xl font-bold text-gray-800">{valor}</p>
    </div>
  );
}
