import { useEffect } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import "./Admin.css";

const CDN_BOOTSTRAP = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";

function Admin() {
  useEffect(() => {
    var link = document.createElement("link");
    link.id = "bootstrap-panel";
    link.rel = "stylesheet";
    link.href = CDN_BOOTSTRAP;
    document.head.appendChild(link);
    document.body.classList.add("modo-admin");

    return () => {
      var viejo = document.getElementById("bootstrap-panel");
      if (viejo) {
        document.head.removeChild(viejo);
      }
      document.body.classList.remove("modo-admin");
    };
  }, []);

  return (
    <div className="admin-panel">
      <div className="container-fluid">
        <div className="row">
          <aside className="col-12 col-md-3 col-lg-2 admin-lateral">
            <h2 className="admin-titulo">
              <i className="fas fa-gamepad"></i> Panel
            </h2>
            <p className="admin-subtitulo">Administracion de la tienda</p>
            <nav className="admin-menu">
              <NavLink to="/admin" end className="admin-enlace">
                <i className="fas fa-chart-line"></i> Resumen
              </NavLink>
              <NavLink to="/admin/productos" className="admin-enlace">
                <i className="fas fa-box"></i> Productos
              </NavLink>
              <NavLink to="/admin/costos" className="admin-enlace">
                <i className="fas fa-coins"></i> Costos
              </NavLink>
              <NavLink to="/admin/pedidos" className="admin-enlace">
                <i className="fas fa-receipt"></i> Pedidos
              </NavLink>
            </nav>
            <Link to="/" className="admin-volver">
              <i className="fas fa-arrow-left"></i> Volver a la tienda
            </Link>
          </aside>
          <section className="col-12 col-md-9 col-lg-10 admin-contenido">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Admin;
