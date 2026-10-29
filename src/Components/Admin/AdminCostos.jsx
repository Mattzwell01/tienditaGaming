import { useState, useEffect } from "react";
import { apiCostos, formatear } from "./api.js";

function AdminCostos() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("margen");

  useEffect(() => {
    apiCostos
      .cargar()
      .then((r) => {
        setDatos(r);
        setError("");
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return <div className="caja-error">{error}</div>;
  }

  if (!datos) {
    return <p className="cargando">Cargando costos ...</p>;
  }

  var lista = datos.productos.slice();
  if (ordenarPor == "margen") {
    lista.sort((a, b) => b.margen - a.margen);
  } else if (ordenarPor == "porcentaje") {
    lista.sort((a, b) => b.porcentaje - a.porcentaje);
  } else if (ordenarPor == "vendido") {
    lista.sort((a, b) => b.unidadesVendidas - a.unidadesVendidas);
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Costos y ganancias</h1>
        <p>Margen de cada producto y valorizacion del inventario</p>
      </div>

      <div className="row">
        <div className="col-12 col-md-4">
          <div className="tarjeta-valor azul">
            <h6>Inventario a costo</h6>
            <div className="valor">{formatear(datos.totalCosto)}</div>
            <div className="pie">lo que se pago por el stock</div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="tarjeta-valor naranja">
            <h6>Inventario a precio</h6>
            <div className="valor">{formatear(datos.totalPrecio)}</div>
            <div className="pie">lo que vale en la tienda</div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="tarjeta-valor verde">
            <h6>Utilidad del inventario</h6>
            <div className="valor">{formatear(datos.utilidadInventario)}</div>
            <div className="pie">diferencia entre precio y costo</div>
          </div>
        </div>
      </div>

      <div className="panel-tabla">
        <h3>Costo por categoria</h3>
        <div className="row">
          {datos.porCategoria.map((categoria) => {
            var costo = categoria.valorCosto;
            var precio = categoria.valorPrecio;
            var porcentaje = precio > 0 ? (costo / precio) * 100 : 0;

            return (
              <div className="col-12 col-md-4 mb-3" key={categoria.categoria}>
                <h6 className="form-label-admin">{categoria.categoria}</h6>
                <div className="barra-costo">
                  <div className="parte-costo" style={{ width: porcentaje + "%" }}></div>
                </div>
                <p className="pie" style={{ fontSize: 12, color: "#77778a" }}>
                  costo {formatear(costo)} de {formatear(precio)} ({porcentaje.toFixed(0)}%)
                </p>
                <p style={{ fontSize: 13, color: "#55556a" }}>
                  {categoria.cantidad} productos / {categoria.unidades} unidades
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel-tabla">
        <h3>Margen por producto</h3>
        <div className="mb-2">
          <select className="mini-input" style={{ width: 220 }} value={ordenarPor} onChange={(e) => setOrdenarPor(e.target.value)}>
            <option value="margen">Ordenar por margen</option>
            <option value="porcentaje">Ordenar por porcentaje</option>
            <option value="vendido">Ordenar por mas vendidos</option>
          </select>
        </div>
        <div className="table-responsive">
          <table className="table tabla-admin align-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Costo</th>
                <th>Margen</th>
                <th>%</th>
                <th>Vendidos</th>
                <th>Ganancia total</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>{formatear(producto.precio)}</td>
                  <td>{formatear(producto.costo)}</td>
                  <td>{formatear(producto.margen)}</td>
                  <td>{producto.porcentaje.toFixed(1)}%</td>
                  <td>{producto.unidadesVendidas}</td>
                  <td>{formatear(producto.gananciaTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminCostos;
