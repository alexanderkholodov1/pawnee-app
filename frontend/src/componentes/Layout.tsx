import { NavLink, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="app">
      <header className="cabecera">
        <NavLink to="/" className="marca">
          <span className="sello">DP</span>
          <span>
            <strong>Departamento de Pawnee</strong>
            <small>Parques y fenómenos inexplicables</small>
          </span>
        </NavLink>
        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "activo" : undefined)}>
            Criaturas
          </NavLink>
          <NavLink to="/avistamientos" className={({ isActive }) => (isActive ? "activo" : undefined)}>
            Avistamientos
          </NavLink>
        </nav>
      </header>
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  );
}
