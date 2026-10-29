import { useState, useEffect } from "react";
import { apiPedidos, formatear } from "./api.js";

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [abierto, setAbierto] = useState(null);

  useEffect(() => {
    apiPedidos
      .listar()
      .then((datos) => {
        setPedidos(datos);
        setError("");
      })
      .catch((e) => setError(e.message));
  }, []);

  function handleCambiarEstado(id, estado) {
    apiPedidos
      .cambiarEstado(id, estado)
      .then(() => {
        apiPedidos.listar().then(setPedidos);
      })
      .catch((e) => setError(e.message));
  }

  var totalVendido = 0;
  pedidos.forEach((pedido) => {
    if (pedido.estado != "cancelado") {
      totalVendido = totalVendido + pedido.total;
    }
  });

  return (
    <div>
      <div className="admin-header">
        <h1>Pedidos</h1>
        <p>Pedidos realizados en la tienda</p>
      </div>

      {error != "" && <div className="caja-error">{error}</div>}

      <div className="row">
        <div className="col-12 col-md-6">
          <div className="tarjeta-valor azul">
            <h6>Pedidos totales</h6>
            <div className="valor">{pedidos.length}</div>
            <div className="pie">{formatear(totalVendido)} vendidos</div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="tarjeta-valor verde">
            <h6>Ticket promedio</h6>
            <div className="valor">{formatear(pedidos.length > 0 ? totalVendido / pedidos.length : 0)}</div>
            <div className="pie">sin contar los cancelados</div>
          </div>
        </div>
      </div>

      <div className="panel-tabla">
        <h3>Listado de pedidos</h3>
        <div className="table-responsive">
          <table className="table tabla-admin align-middle">
            <thead>
              <tr>
                <th>N°</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>
                    {pedido.cliente}
                    <br />
                    <small style={{ color: "#9999aa" }}>{pedido.email}</small>
                  </td>
                  <td>{pedido.fecha}</td>
                  <td>
                    <select
                      className="mini-input"
                      value={pedido.estado}
                      onChange={(e) => handleCambiarEstado(pedido.id, e.target.value)}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td>{formatear(pedido.total)}</td>
                  <td>
                    <button className="boton-icono" onClick={() => setAbierto(abierto == pedido.id ? null : pedido.id)}>
                      <i className="fas fa-chevron-down"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {abierto != null && (
          <div className="detalle-pedido">
            <table className="table tabla-admin">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Costo</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {pedidos
                  .filter((p) => p.id == abierto)
                  .map((p) =>
                    p.detalle.map((linea) => (
                      <tr>
                        <td>{linea.nombre_producto}</td>
                        <td>{linea.cantidad}</td>
                        <td>{formatear(linea.precio_unitario)}</td>
                        <td>{formatear(linea.costo_unitario)}</td>
                        <td>{formatear(linea.precio_unitario * linea.cantidad)}</td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPedidos;
