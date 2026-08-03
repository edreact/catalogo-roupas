import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import Footer from "./Footer";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catalogo" },
  { to: "/favoritos", label: "Favoritos" },
];

export default function Layout() {
  const location = useLocation();

  function scrollToTopInstantly() {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    root.style.scrollBehavior = previousScrollBehavior;
  }

  useEffect(() => {
    scrollToTopInstantly();
  }, [location.pathname, location.search]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink
          to="/"
          className="brand"
          aria-label="Ir para a pagina inicial"
          onClick={scrollToTopInstantly}
        >
          <span className="brand-mark">CF</span>

          <span>
            <strong>Catalogo Feminino</strong>
            <small>moda selecionada</small>
          </span>
        </NavLink>

        <nav className="main-nav" aria-label="Navegacao principal">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={scrollToTopInstantly}>
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
