"use client";

import { useState } from "react";

interface Transaccion {
  transaccion_id: number;
  usuario_id: string;
  nombre: string | null;
  motivo: string | null;
  fecha: string;
  tipo_movimiento: "ingreso" | "egreso";
  tipo_category:
    | "entretenimiento"
    | "servicios"
    | "alimentos"
    | "inmueble"
    | "viajes"
    | "salud"
    | "rodados"
    | "educacion"
    | "vestimenta"
    | "tecnologia"
    | "trabajo"
    | "otros";
  monto: number;
}

interface EditTransactionFormProps {
  transaction: Transaccion;
  onSave: (data: Partial<Transaccion>) => Promise<void>;
  onCancel: () => void;
}

export default function EditTransactionForm({
  transaction,
  onSave,
  onCancel,
}: EditTransactionFormProps) {
  const [formData, setFormData] = useState({
    nombre: transaction.nombre || "",
    motivo: transaction.motivo || "",
    fecha: transaction.fecha.split("T")[0],
    tipo_movimiento: transaction.tipo_movimiento,
    tipo_category: transaction.tipo_category,
    monto: transaction.monto.toString(),
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave({
        nombre: formData.nombre || null,
        motivo: formData.motivo || null,
        fecha: formData.fecha,
        tipo_movimiento: formData.tipo_movimiento,
        tipo_category: formData.tipo_category,
        monto: parseFloat(formData.monto),
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categorias = [
    "entretenimiento",
    "servicios",
    "alimentos",
    "inmueble",
    "viajes",
    "salud",
    "rodados",
    "educacion",
    "vestimenta",
    "tecnologia",
    "trabajo",
    "otros",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Nombre</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Motivo</label>
        <input
          type="text"
          value={formData.motivo}
          onChange={(e) => setFormData((prev) => ({ ...prev, motivo: e.target.value }))}
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Fecha</label>
        <input
          type="date"
          value={formData.fecha}
          onChange={(e) => setFormData((prev) => ({ ...prev, fecha: e.target.value }))}
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Tipo de Movimiento</label>
        <select
          value={formData.tipo_movimiento}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, tipo_movimiento: e.target.value as "ingreso" | "egreso" }))
          }
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        >
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Categoría</label>
        <select
          value={formData.tipo_category}
          onChange={(e) => setFormData((prev) => ({ ...prev, tipo_category: e.target.value as any }))}
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Monto</label>
        <input
          type="number"
          value={formData.monto}
          onChange={(e) => setFormData((prev) => ({ ...prev, monto: e.target.value }))}
          className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 p-2 bg-muted border border-input rounded-md text-foreground hover:bg-muted/70 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
