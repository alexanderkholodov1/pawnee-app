/**
 * paginas/DetalleCriatura.tsx
 * -------------------------------
 * Muestra una criatura completa y la lista de sus avistamientos, usando
 * la ruta anidada del backend. También permite eliminar la criatura.
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eliminarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { obtenerAvistamientosDeCriatura } from "../api/avistamientosApi";
import { Criatura, ETIQUETA_ESTADO, ETIQUETA_TIPO } from "../tipos";

// El backend anida los avistamientos bajo /criaturas/:id/avistamientos
// SIN populate (ver criaturas.controller.ts de la Semana 6) — por eso aquí
// el campo `criatura` es un string, no un objeto.
interface AvistamientoSinPopular {
  _id: string;
  testigo: string;
  ubicacion: string;
  descripcion?: string;
  fecha: string;
}

export function DetalleCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [criatura, setCriatura] = useState<Criatura | null>(null);
  const [avistamientos, setAvistamientos] = useState<AvistamientoSinPopular[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([obtenerCriaturaPorId(id), obtenerAvistamientosDeCriatura(id)])
      .then(([criaturaCargada, avistamientosCargados]) => {
        setCriatura(criaturaCargada);
        setAvistamientos(avistamientosCargados as unknown as AvistamientoSinPopular[]);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEliminar() {
    if (!id) return;
    if (!window.confirm("¿Seguro que quieres eliminar esta criatura?")) return;

    try {
      await eliminarCriatura(id);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la criatura.");
    }
  }

  if (cargando) return <p className="aviso">Cargando...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!criatura) return <p className="vacio">No se encontró la criatura.</p>;

  return (
    <section>
      <Link className="volver" to="/">
        Volver a la lista
      </Link>

      <header className="pagina-encabezado">
        <div>
          <p className="kicker">Ficha de criatura</p>
          <h1>{criatura.nombre}</h1>
        </div>
        <div className="acciones">
          <Link className="boton secundario" to={`/criaturas/${criatura._id}/editar`}>
            Editar
          </Link>
          <button type="button" className="eliminar" onClick={manejarEliminar}>
            Eliminar
          </button>
        </div>
      </header>

      <ul className="ficha">
        <li>
          <span>Tipo</span>
          {ETIQUETA_TIPO[criatura.tipo]}
        </li>
        <li>
          <span>Nivel de peligro</span>
          {criatura.nivelPeligro}/10
        </li>
        <li>
          <span>Estado</span>
          {ETIQUETA_ESTADO[criatura.estado]}
        </li>
        <li>
          <span>Habilidades</span>
          {criatura.habilidades.join(", ") || "Ninguna registrada"}
        </li>
      </ul>

      <div className="panel">
        <header className="pagina-encabezado">
          <h2>Avistamientos</h2>
          <Link className="boton" to={`/avistamientos/nuevo?criaturaId=${criatura._id}`}>
            Registrar avistamiento
          </Link>
        </header>

        {avistamientos.length === 0 ? (
          <p className="vacio">Todavía no hay avistamientos registrados para esta criatura.</p>
        ) : (
          <ul className="lista">
            {avistamientos.map((avistamiento) => (
              <li key={avistamiento._id}>
                <strong>{avistamiento.fecha.slice(0, 10)}</strong> — {avistamiento.testigo} en {avistamiento.ubicacion}
                {avistamiento.descripcion ? ` (${avistamiento.descripcion})` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
