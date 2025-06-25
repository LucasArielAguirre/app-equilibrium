"use client";

import FloatingNavTables from "./FloatingNavTables";

interface Props {
  userId: string;
}

import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { NewMovimientoForm } from "../new-movimiento-form";
import EditTransactionForm from "../EditTransactionForm";
import { useState, useEffect } from "react";
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




export default function TablesView({ userId }: Props) {
    const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
    const [editingTransaction, setEditingTransaction] = useState<Transaccion | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
    const [supabase] = useState(() =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    );
  
    const fetchTransacciones = async () => {
      const { data, error } = await supabase
        .from("control")
        .select("*")
        .eq("usuario_id", userId)
        .order("fecha", { ascending: false });
  
      if (error) {
        console.error("Error al obtener datos:", error);
      } else {
        setTransacciones(data as Transaccion[]);
      }
    };
  
    useEffect(() => {
      fetchTransacciones();
    }, [userId, supabase]);
  
    // delete transaccion
    const handleDelete = async (transaccionId: number) => {
      if (!confirm("¿Estás seguro de que quieres eliminar esta transacción?")) {
        return;
      }
  
      try {
        const { error } = await supabase
          .from("control")
          .delete()
          .eq("transaccion_id", transaccionId);
  
        if (error) {
          console.error("Error al eliminar:", error);
          alert("Error al eliminar la transacción");
        } else {
          setTransacciones(prev => prev.filter(t => t.transaccion_id !== transaccionId));
          alert("Transacción eliminada exitosamente");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al eliminar la transacción");
      }
    };
  
    // dialog de edicion 
    const handleEdit = (transaccion: Transaccion) => {
      setEditingTransaction(transaccion);
      setIsEditDialogOpen(true);
    };
  
    // actualizar transaccion
    const handleUpdate = async (updatedData: Partial<Transaccion>) => {
      if (!editingTransaction) return;
  
      try {
        const { error } = await supabase
          .from("control")
          .update(updatedData)
          .eq("transaccion_id", editingTransaction.transaccion_id);
  
        if (error) {
          console.error("Error al actualizar:", error);
          alert("Error al actualizar la transacción");
        } else {
          // actualiza lista
          setTransacciones(prev => 
            prev.map(t => 
              t.transaccion_id === editingTransaction.transaccion_id 
                ? { ...t, ...updatedData }
                : t
            )
          );
          setIsEditDialogOpen(false);
          setEditingTransaction(null);
          alert("Transacción actualizada exitosamente");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al actualizar la transacción");
      }
    };
  
    const ingresosPorCategoria: Record<string, number> = {};
    const egresosPorCategoria: Record<string, number> = {};
  
    transacciones.forEach((t) => {
      if (t.tipo_movimiento === "ingreso") {
        ingresosPorCategoria[t.tipo_category] =
          (ingresosPorCategoria[t.tipo_category] || 0) + t.monto;
      } else {
        egresosPorCategoria[t.tipo_category] =
          (egresosPorCategoria[t.tipo_category] || 0) + t.monto;
      }
    });
  
    const categorias = Array.from(
      new Set([
        ...Object.keys(ingresosPorCategoria),
        ...Object.keys(egresosPorCategoria),
      ])
    );
  
  
    // all balance
    const montoFinal = transacciones.reduce((total, t) => {
      return t.tipo_movimiento === "egreso" ? total - t.monto : total + t.monto;
    }, 0);
  return (
    <div className=" flex flex-col items-center h-full w-full  py-10">
    <h1 className="text-2xl font-bold mb-4">Your tables</h1>
    <div className="max-w-9xl p-4 bg-card rounded-lg shadow-md items-cente shadow-primary">
 <table className="w-full border-collapse overflow-y-auto">
              <thead className="bg-primary">
                <tr>
                  <th className="border-b border-border p-3 text-left text-foreground font-semibold">Nombre</th>
                  <th className="border-b border-border p-3 text-left text-foreground font-semibold">Categoría</th>
                  <th className="border-b border-border p-3 text-left text-foreground font-semibold">Fecha</th>
                  <th className="border-b border-border p-3 text-left text-foreground font-semibold">Motivo</th>
                  <th className="border-b border-border p-3 text-left text-foreground font-semibold">Monto</th>
                  <th className="border-b border-border p-3 text-center text-foreground font-semibold">Eliminar</th>
                  <th className="border-b border-border p-3 text-center text-foreground font-semibold">Editar</th>
                </tr>
              </thead>
              <tbody>
                {transacciones.map((t, index) => (
                  <tr key={t.transaccion_id} className={`${index % 2 === 0 ? 'bg-card' : 'bg-muted/30'} hover:bg-accent transition-colors`}>
                    <td className="border-b border-border p-3 text-foreground">{t.nombre || "-"}</td>
                    <td className="border-b border-border p-3 text-foreground capitalize">{t.tipo_category}</td>
                    <td className="border-b border-border p-3 text-foreground">
                      {new Date(t.fecha).toLocaleDateString()}
                    </td>
                    <td className="border-b border-border p-3 text-foreground">{t.motivo || "-"}</td>
                    <td className="border-b border-border p-3 font-semibold">
                      <span className={t.tipo_movimiento === "egreso" ? "text-destructive" : "text-chart-2"}>
                        {t.tipo_movimiento === "egreso" ? "-" : ""}${t.monto.toFixed(2)}
                      </span>
                    </td>
                    <td className="border-b border-border p-3 text-center">
                      <button
                        className="hover:text-destructive transition-colors p-2 hover:scale-110 hover:bg-destructive/10 rounded"
                        onClick={() => handleDelete(t.transaccion_id)}
                        title="Eliminar transacción"
                      >
                        🗑️
                      </button>
                    </td>
                    <td className="border-b border-border p-3 text-center">
                      <button
                        className="hover:text-primary transition-colors p-2 hover:scale-110 hover:bg-primary/10 rounded"
                        onClick={() => handleEdit(t)}
                        title="Editar transacción"
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
</div>
             <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogContent className="max-w-md">
                        <DialogTitle>Editar Transacción</DialogTitle>
                        {editingTransaction && (
                          <EditTransactionForm 
                            transaction={editingTransaction}
                            onSave={handleUpdate}
                            onCancel={() => {
                              setIsEditDialogOpen(false);
                              setEditingTransaction(null);
                            }}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
<FloatingNavTables/>
    </div>
  );
}