import { NavLink, Outlet } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import Footer from "./Footer";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catalogo" },
  { to: "/favoritos", label: "Favoritos" },
];

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink
          to="/"
          className="brand"
          aria-label="Ir para a pagina inicial"
        >
          <span className="brand-mark">CF</span>

          <span>
            <strong>Catalogo Feminino</strong>
            <small>moda selecionada</small>
          </span>
        </NavLink>

        <nav className="main-nav" aria-label="Navegacao principal">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <ThemeToggle />
      </header>

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}