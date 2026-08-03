import { useLayoutEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import Footer from "./Footer";
import { scrollToPageTop } from "../../utils/scroll.js";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catalogo" },
  { to: "/favoritos", label: "Favoritos" },
];

export default function Layout() {
  const location = useLocation();

  useLayoutEffect(() => {
    scrollToPageTop();
  }, [location.pathname, location.search]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink
          to="/"
          className="brand"
          aria-label="Ir para a pagina inicial"
          onClick={scrollToPageTop}
        >
          <span className="brand-mark">CF</span>

          <span>
            <strong>Catalogo Feminino</strong>
            <small>moda selecionada</small>
          </span>
        </NavLink>

        <nav className="main-nav" aria-label="Navegacao principal">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={scrollToPageTop}>
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
