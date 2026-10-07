/**
 * paginas/ListaCriaturas.tsx
 * ------------------------------
 * Página de solo lectura: lista todas las criaturas.
 * Maneja los 3 estados: loading, error y empty.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerCriaturas } from "../api/criaturasApi";
import { Criatura, ETIQUETA_ESTADO, ETIQUETA_TIPO, TipoCriatura, TIPOS_CRIATURA } from "../tipos";

export function ListaCriaturas() {
  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<TipoCriatura | "">("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCargando(true);
    setError(null);

    obtenerCriaturas(filtroTipo || undefined)
      .then(setCriaturas)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Error al cargar las criaturas.");
      })
      .finally(() => setCargando(false));
  }, [filtroTipo]);

  return (
    <section>
      <header className="pagina-encabezado">
        <div>
          <p className="kicker">Archivo de campo</p>
          <h1>Criaturas de Pawnee</h1>
          <p className="bajada">Especies bajo vigilancia del departamento. Filtra por tipo o abre una ficha.</p>
        </div>
        <Link className="boton" to="/criaturas/nueva">
          Registrar criatura
        </Link>
      </header>

      <div className="barra">
        <label htmlFor="filtro-tipo">Filtrar por tipo</label>
        <select
          id="filtro-tipo"
          value={filtroTipo}
          onChange={(evento) => setFiltroTipo(evento.target.value as TipoCriatura | "")}
        >
          <option value="">Todos los tipos</option>
          {TIPOS_CRIATURA.map((tipo) => (
            <option key={tipo} value={tipo}>
              {ETIQUETA_TIPO[tipo]}
            </option>
          ))}
        </select>
      </div>

      {cargando && <p className="aviso">Cargando criaturas...</p>}
      {!cargando && error && <p className="error">Ocurrió un error: {error}</p>}
      {!cargando && !error && criaturas.length === 0 && (
        <p className="vacio">Todavía no hay criaturas registradas.</p>
      )}

      {!cargando && !error && criaturas.length > 0 && (
        <div className="rejilla">
          {criaturas.map((criatura) => (
            <article className="tarjeta" key={criatura._id}>
              <div className="meta">
                <span className={`insignia ${criatura.tipo}`}>{ETIQUETA_TIPO[criatura.tipo]}</span>
                <span className={`insignia ${criatura.estado}`}>{ETIQUETA_ESTADO[criatura.estado]}</span>
              </div>
              <h2>{criatura.nombre}</h2>
              <div>
                <div className="peligro" aria-hidden="true">
                  <span style={{ width: `${criatura.nivelPeligro * 10}%` }} />
                </div>
                <p className="peligro-texto">Peligro {criatura.nivelPeligro}/10</p>
              </div>
              <div className="acciones">
                <Link className="boton" to={`/criaturas/${criatura._id}`}>
                  Ver ficha
                </Link>
                <Link className="boton secundario" to={`/criaturas/${criatura._id}/editar`}>
                  Editar
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
