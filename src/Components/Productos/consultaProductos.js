import productosJson from "./productos.json";

export function tieneStock(producto) {
  if (producto.stock === undefined || producto.stock === null) {
    return true;
  }
  return producto.stock > 0;
}

export function consultarProductos() {
  return fetch("/api/productos")
    .then((r) => {
      if (!r.ok) {
        throw new Error("No se pudo leer el catalogo");
      }
      return r.json();
    })
    .then((datos) => datos.filter(tieneStock))
    .catch(() => productosJson.filter(tieneStock));
}
