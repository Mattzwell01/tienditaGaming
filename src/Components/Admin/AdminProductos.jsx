import { useState, useEffect } from "react";
import { apiProductos, formatear } from "./api.js";

const FORMULARIO_VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  costo: "",
  stock: "",
  categoria: "consola",
  imagen: "",
};

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [orden, setOrden] = useState("id");
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(8);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    apiProductos
      .listar(buscar, categoria, orden)
      .then((datos) => {
        setProductos(datos);
        setError("");
      })
      .catch((e) => setError(e.message));
  }, [buscar, categoria, orden]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (formulario.nombre.trim() == "") {
      setError("El nombre del producto no puede estar vacio");
      setMensaje("");
      return;
    }

    if (isNaN(Number(formulario.precio)) || Number(formulario.precio) < 0) {
      setError("El precio tiene que ser un numero valido");
      setMensaje("");
      return;
    }

    if (editando) {
      apiProductos
        .actualizar(formulario.id, formulario)
        .then(() => {
          setMensaje("Producto actualizado");
          setError("");
          setFormulario(FORMULARIO_VACIO);
          setEditando(false);
          recargar();
        })
        .catch((e) => setError(e.message));
    } else {
      apiProductos
        .crear(formulario)
        .then(() => {
          setMensaje("Producto creado correctamente");
          setError("");
          setFormulario(FORMULARIO_VACIO);
          recargar();
          console.log("se creo el producto", formulario.nombre);
        })
        .catch((e) => setError(e.message));
    }
  }

  function recargar() {
    apiProductos.listar(buscar, categoria, orden).then(setProductos);
  }

  function handleEditar(producto) {
    setFormulario({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      costo: producto.costo,
      stock: producto.stock,
      categoria: producto.categoria,
      imagen: producto.imagen,
    });
    setEditando(true);
    setMensaje("");
    setError("");
  }

  function handleCancelar() {
    setFormulario(FORMULARIO_VACIO);
    setEditando(false);
  }

  function handleEliminar(producto) {
    if (window.confirm("Seguro que quieres eliminar " + producto.nombre + "?")) {
      apiProductos
        .eliminar(producto.id)
        .then((r) => {
          setMensaje(r.mensaje);
          setError("");
          recargar();
        })
        .catch((e) => setError(e.message));
    }
  }

  var totalPaginas = Math.ceil(productos.length / porPagina);
  if (totalPaginas == 0) {
    totalPaginas = 1;
  }
  var inicio = (pagina - 1) * porPagina;
  var productosPaginados = productos.slice(inicio, inicio + porPagina);

  return (
    <div>
      <div className="admin-header">
        <h1>Administrar productos</h1>
        <p>Agregar, editar y eliminar productos del catalogo</p>
      </div>

      {error != "" && <div className="caja-error">{error}</div>}
      {mensaje != "" && <div className="caja-ok">{mensaje}</div>}

      <div className="row">
        <div className="col-12 col-xl-8">
          <div className="panel-tabla">
            <h3>Listado de productos ({productos.length})</h3>

            <div className="row">
              <div className="col-12 col-md-5 mb-2">
                <input
                  type="search"
                  className="mini-input"
                  placeholder="Buscar por nombre"
                  value={buscar}
                  onChange={(e) => {
                    setBuscar(e.target.value);
                    setPagina(1);
                  }}
                />
              </div>
              <div className="col-6 col-md-3 mb-2">
                <select
                  className="mini-input"
                  value={categoria}
                  onChange={(e) => {
                    setCategoria(e.target.value);
                    setPagina(1);
                  }}
                >
                  <option value="todas">Todas</option>
                  <option value="consola">Consolas</option>
                  <option value="periferico">Perifericos</option>
                  <option value="videojuego">Videojuegos</option>
                </select>
              </div>
              <div className="col-6 col-md-2 mb-2">
                <select className="mini-input" value={orden} onChange={(e) => setOrden(e.target.value)}>
                  <option value="id">Por id</option>
                  <option value="precio">Menor precio</option>
                  <option value="precio_desc">Mayor precio</option>
                  <option value="stock">Menos stock</option>
                </select>
              </div>
              <div className="col-6 col-md-2 mb-2">
                <select
                  className="mini-input"
                  value={porPagina}
                  onChange={(e) => setPorPagina(Number(e.target.value))}
                >
                  <option value="8">8 por pagina</option>
                  <option value="12">12 por pagina</option>
                  <option value="20">20 por pagina</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table tabla-admin align-middle">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Costo</th>
                    <th>Stock</th>
                    <th>Categoria</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {productosPaginados.length === 0 ? (
                    <tr>
                      <td colSpan="7">No hay productos que coincidan con la busqueda</td>
                    </tr>
                  ) : (
                    productosPaginados.map((producto) => (
                      <tr key={producto.id}>
                        <td>{producto.id}</td>
                        <td>{producto.nombre}</td>
                        <td>{formatear(producto.precio)}</td>
                        <td>{formatear(producto.costo)}</td>
                        <td>
                          {producto.stock}
                          {producto.stock == 0 && <span className="marca-oculto">oculto</span>}
                        </td>
                        <td>
                          <span className="marca-categoria">{producto.categoria}</span>
                        </td>
                        <td>
                          <button className="boton-icono" onClick={() => handleEditar(producto)} title="Editar">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="boton-icono" onClick={() => handleEliminar(producto)} title="Eliminar">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="paginacion">
              <button onClick={() => setPagina(pagina - 1)} disabled={pagina == 1}>
                Anterior
              </button>
              {Array.from({ length: totalPaginas }, (x, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={num == pagina ? "activa" : ""}
                  onClick={() => setPagina(num)}
                >
                  {num}
                </button>
              ))}
              <button onClick={() => setPagina(pagina + 1)}>
                Siguiente
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="panel-tabla">
            <h3>{editando ? "Editar producto" : "Nuevo producto"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label-admin">Nombre</label>
                <input type="text" name="nombre" className="mini-input" value={formulario.nombre} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label-admin">Descripcion</label>
                <textarea
                  name="descripcion"
                  className="mini-input"
                  rows="3"
                  value={formulario.descripcion}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="row">
                <div className="col-6 mb-2">
                  <label className="form-label-admin">Precio</label>
                  <input type="number" name="precio" className="mini-input" value={formulario.precio} onChange={handleChange} />
                </div>
                <div className="col-6 mb-2">
                  <label className="form-label-admin">Costo</label>
                  <input type="number" name="costo" className="mini-input" value={formulario.costo} onChange={handleChange} />
                </div>
                <div className="col-6 mb-2">
                  <label className="form-label-admin">Stock</label>
                  <input type="number" name="stock" className="mini-input" value={formulario.stock} onChange={handleChange} />
                </div>
                <div className="col-6 mb-2">
                  <label className="form-label-admin">Categoria</label>
                  <select name="categoria" className="mini-input" value={formulario.categoria} onChange={handleChange}>
                    <option value="consola">Consolas</option>
                    <option value="periferico">Perifericos</option>
                    <option value="videojuego">Videojuegos</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label-admin">Imagen (url)</label>
                <input type="text" name="imagen" className="mini-input" value={formulario.imagen} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-dark w-100">
                <i className="fas fa-save"></i> {editando ? "Guardar cambios" : "Agregar producto"}
              </button>
              {editando && (
                <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={handleCancelar}>
                  Cancelar
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProductos;
