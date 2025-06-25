"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function NewMovimientoForm({ userId }: { userId: string }) {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState<"ingreso" | "egreso">("ingreso");
  const [categoria, setCategoria] = useState("otros");
  const [motivo, setMotivo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("control").insert({
      usuario_id: userId,
      nombre,
      tipo_movimiento: tipo,
      motivo: motivo, 
      tipo_category: categoria,
      monto: parseFloat(monto),
      fecha: new Date().toISOString(), 
    });

    if (error) {
      console.error("Error al insertar movimiento:", error);
      return;
    }

    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 gap-x-2">
      <div>
        <Label>Nombre</Label>
        <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
    <div>
        <Label>Motivo</Label>
        <Input value={motivo} onChange={(e) => setMotivo(e.target.value)} />
      </div>
      <div>
        <Label>Monto</Label>
        <Input
          type="number"
          step="0.01"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
      </div>

      <div className="">
        <Label>Tipo: </Label>
        <select className=""value={tipo} onChange={(e) => setTipo(e.target.value as any)}>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
      </div>

      <div>
        <Label>Categoría: </Label>
    <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
  <option value="entretenimiento">Entretenimiento</option>
  <option value="servicios">Servicios</option>
  <option value="alimentos">Alimentos</option>
  <option value="inmueble">Inmueble</option>
  <option value="viajes">Viajes</option>
  <option value="salud">Salud</option>
  <option value="rodados">Rodados</option>
  <option value="educacion">Educación</option>
  <option value="vestimenta">Vestimenta</option>
  <option value="tecnologia">Tecnología</option>
  <option value="trabajo">Trabajo</option>
  <option value="otros">Otros</option>
</select>
      </div>

      <Button type="submit">Guardar</Button>
    </form>
  );
}
