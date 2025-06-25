"use client";

import { useEffect, useState } from "react";
import { color, motion } from "motion/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { NewMovimientoForm } from "./new-movimiento-form";
import FloatingNav from "./FloatingNav";
import EditTransactionForm from "./EditTransactionForm";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  userId: string;
}

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

interface DolarBlue {
  value_avg: number;
  value_sell: number;
  value_buy: number;
}

export default function DashboardView({ userId }: Props) {
  const [dolarBlue, setDolarBlue] = useState<DolarBlue | null>(null);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaccion | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  useEffect(() => {
    fetch("https://api.bluelytics.com.ar/v2/latest")
      .then((response) => response.json())
      .then((data) => setDolarBlue(data.blue))
      .catch(() => setDolarBlue(null));
  }, []);

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

  const data = {
    labels: categorias,
    datasets: [
      {
        label: "Ingresos",
        data: categorias.map((cat) => ingresosPorCategoria[cat] || 0),
        backgroundColor: "rgba(34,197,94,0.7)", 
        color: "#22c55e",
      },
      {
        label: "Egresos",
        data: categorias.map((cat) => egresosPorCategoria[cat] || 0),
        backgroundColor: "rgba(220,38,38,0.7)", 
        color: "#dc2626", 
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#7c3aed",
        },
      },
      title: {
        display: true,
        text: "Ingresos y Egresos por Categoría",
        color: "#7c3aed",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#7c3aed",
        },
        grid: {
          color: "#7c3aed",
        },
      },
      y: {
        ticks: {
          color: "#7c3aed",
        },
        grid: {
          color: "#7c3aed",
        },
      },
    },
  };

  // all balance
  const montoFinal = transacciones.reduce((total, t) => {
    return t.tipo_movimiento === "egreso" ? total - t.monto : total + t.monto;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-[80%]  bg-background h-[100dvh] py-3"
    >
      <div className="grid grid-cols-6 grid-rows-9 gap-6 w-full h-full">
        <div className="rounded-xl col-span-2 row-span-3 border border-border justify-center align-middle text-center flex flex-col items-center bg-card shadow-lg p-6">
          <h1 className="text-foreground text-6xl font-bold">BALANCE</h1>
          <h2 className="text-foreground text-2xl font-light mt-2">
            ${montoFinal.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            <span className="text-chart-2">$ USD</span>
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-5 w-[60%] bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200">
                Agregar Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Agregar nuevo movimiento</DialogTitle>
              <NewMovimientoForm userId={userId} />
            </DialogContent>
          </Dialog>
        </div>

  
        <div className="col-span-2 row-span-3 col-start-3 border border-border bg-muted rounded-xl p-6  items-center justify-center shadow-lg clip-custom flex flex-col">
          <h1 className="text-center top-0 mx-auto text-xl font-semibold text-muted-foreground decoration-primary">
            CONSEJO HECHO POR IA
          </h1>

          <p className="text-sm text-center text-muted-foreground">Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque dolorem distinctio ducimus veritatis molestias? </p>
        </div>

      
        <div className="col-span-2 row-span-3 col-start-5 border border-border rounded-xl bg-primary text-primary-foreground shadow-lg p-6">
          {dolarBlue ? (
            <div className="w-full h-full flex">
              <div className="space-y-4 flex flex-col items-center text-center justify-center m-auto">
                <div className="flex flex-col">
                  <span className="text-primary-foreground text-4xl font-bold">Dólar Blue</span>
                  <h2 className="text-2xl font-light mt-2">
                    ${dolarBlue.value_avg}{" "}
                    <span className="text-chart-2">$ USD</span>
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="flex flex-col items-center justify-center py-1 px-2 bg-primary-foreground/10 rounded-lg">
                    <span className="text-sm text-primary-foreground/70 font-medium">COMPRA</span>
                    <h2 className="text-sm font-semibold">
                      ${dolarBlue.value_buy}
                    </h2>
                  </div>
                  <div className="flex flex-col items-center justify-center py-1 px-2 bg-primary-foreground/10 rounded-lg">
                    <span className="text-sm text-primary-foreground/70 font-medium">VENTA</span>
                    <h2 className="text-sm font-semibold">
                      ${dolarBlue.value_sell}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <h1 className="text-primary-foreground text-lg">Cargando...</h1>
            </div>
          )}
        </div>

      
        <div className="row-span-3 row-start-4 border border-border bg-card rounded-xl p-4 shadow-lg">
          <div className="w-full h-full flex items-center justify-center align-middle text-muted-foreground">
            <h1 className="w-full text-center text-muted-foreground uppercase">
              Contenido adicional
              </h1>
          </div>
        </div>
        <div className="row-span-3 row-start-4 border border-border bg-card rounded-xl p-4 shadow-lg">
          <div className="w-full h-full flex items-center justify-center align-middle text-muted-foreground">
           <h1 className="w-full text-center text-muted-foreground uppercase">
            Contenido adicional
            </h1> 
          </div>
        </div>

    
        <div className=" shadow-lg col-span-4 row-span-3 row-start-4 border border-border bg-secondary rounded-xl p-6 flex justify-center items-center align-middle">
          <div className="w-full h-full justify-center items-center align-middle flex">
            <Bar options={options} data={data} />
          </div>
        </div>

        <div className="col-span-6 row-span-3 row-start-7 border border-border bg-card rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-auto h-full">
            <table className="w-full border-collapse">
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
                {transacciones.slice(0, 10).map((t, index) => (
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
        </div>

        {/* dialog de editcion */}        
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

        <FloatingNav />
      </div>
    </motion.div>
  );
}
