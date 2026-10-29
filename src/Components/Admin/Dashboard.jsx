import { useState, useEffect } from "react";
import { apiResumen, formatear } from "./api.js";

function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiResumen
      .cargar()
      .then((datos) => setResumen(datos))
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return <div className="caja-error">{error}</div>;
  }

  if (!resumen) {
    return <p className="cargando">Cargando resumen de la tienda ...</p>;
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Resumen general</h1>
        <p>Estado de la tienda hoy</p>
      </div>

      <div className="row">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="tarjeta-valor">
            <h6>Productos</h6>
            <div className="valor">{resumen.totalProductos}</div>
            <div className="pie">{resumen.unidades} unidades en stock</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="tarjeta-valor azul">
            <h6>Ventas</h6>
            <div className="valor">{formatear(resumen.ventas)}</div>
            <div className="pie">{resumen.cantidadPedidos} pedidos registrados</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="tarjeta-valor verde">
            <h6>Ganancia</h6>
            <div className="valor">{formatear(resumen.ganancia)}</div>
            <div className="pie">margen de {resumen.margen.toFixed(1)}%</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="tarjeta-valor naranja">
            <h6>Inventario</h6>
            <div className="valor">{formatear(resumen.valorCosto)}</div>
            <div className="pie">valorizado a costo</div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-lg-6">
          <div className="panel-tabla">
            <h3>Productos con poco stock</h3>
            {resumen.bajoStock.length === 0 ? (
              <p className="cargando">Todos los productos tienen stock suficiente</p>
            ) : (
              <table className="table tabla-admin">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.bajoStock.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.nombre}</td>
                      <td>
                        <span className="marca-categoria">{producto.stock} uds</span>
                      </td>
                      <td>{formatear(producto.precio)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="panel-tabla">
            <h3>Productos por categoria</h3>
            <table className="table tabla-admin">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Productos</th>
                  <th>Unidades</th>
                </tr>
              </thead>
              <tbody>
                {resumen.porCategoria.map((categoria) => (
                  <tr key={categoria.categoria}>
                    <td>{categoria.categoria}</td>
                    <td>{categoria.cantidad}</td>
                    <td>{categoria.unidades}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
