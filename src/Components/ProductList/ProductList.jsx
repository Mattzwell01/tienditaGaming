import { useState, useEffect } from "react";
import "./ProductList.css";
import { consultarProductos } from "../Productos/consultaProductos";
import { useNavigate } from "react-router-dom";

const ProductList = ({buscarTermino}) => {
  const [error] = useState(null);
  const [orden, setOrden] = useState("Relevante");
  const [filtros, setFiltros] = useState({ categorias: [] });
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    consultarProductos().then((datos) => setProductos(datos));
  }, []);

  const toggleFiltro = (tipoFiltro, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [tipoFiltro]: prev[tipoFiltro].includes(valor)
        ? prev[tipoFiltro].filter((item) => item !== valor)
        : [...prev[tipoFiltro], valor],
    }))
  }

  const normalizarTexto = (texto) => {
    return String(texto)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const productosFiltrados = productos.filter((producto) => {
    const matchCategoria = filtros.categorias.length === 0 || filtros.categorias.includes(producto.categoria);

    const matchBuscar = !buscarTermino || normalizarTexto(producto.nombre).includes(normalizarTexto(buscarTermino)) ||
      normalizarTexto(producto.descripcion).includes(normalizarTexto(buscarTermino));

    return matchCategoria && matchBuscar;
  })

  const handleOrdenChange = (e) => {
    setOrden(e.target.value)
  }

  const productosOrdenanos = [...productosFiltrados].sort((a, b) => {
    if (orden === "Precio Menor a Mayor") {
      return a.precio - b.precio
    }
    if (orden === "Precio Mayor a Menor") {
        return b.precio - a.precio
    }
    return 0;
  });

  const handleImageClick = (id) => {
    navigate(`/producto/${id}`);
  }

  return (
    <section className="main-content">
      <aside className="filters">
        <h2>Filtros</h2>
        <div className="filters-category">
          <div className="filter-category">
            <h3>Categorias</h3>
            <label>
              <input type="checkbox" onChange={() => toggleFiltro("categorias", "consola")}/>
              <span>Consolas</span>
            </label>
            <label>
              <input type="checkbox"  onChange={() => toggleFiltro("categorias", "periferico")}/>
              <span>Perifericos</span>
            </label>
            <label>
              <input type="checkbox"  onChange={() => toggleFiltro("categorias", "videojuego")}/>
              <span>Videojuegos</span>
            </label>
          </div>
        </div>
      </aside>
      <main className="collections">
        <div className="options">
          <h2>TODAS LAS COLECCIONES</h2>
          <div className="sort-options">
            <label>
              Ordenar por:
              <select onChange={handleOrdenChange} value={orden}>
                <option>Relevante</option>
                <option>Precio Menor a Mayor</option>
                <option>Precio Mayor a Menor</option>
              </select>
            </label>
          </div>
        </div>
        <div className="products">
          {error ? (
            <p className="error-message">{error}</p>): (
              productosOrdenanos.map((producto) => (
                <div className="product-card" key={producto.id}>
                  <img src={producto.imagen} alt={producto.image} className="product-image"
                    onClick={() => handleImageClick(producto.id)} />
                  <h3>{producto.nombre}</h3>
                  <p>${producto.precio}</p>
                </div>
              ))
          )}
        </div>
      </main>
    </section>
  )
}
export default ProductList
