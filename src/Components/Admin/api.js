const BASE = "/api";

async function pedir(ruta, opciones) {
  const r = await fetch(BASE + ruta, opciones);
  if (!r.ok) {
    throw new Error("No se pudo conectar con el servidor");
  }
  return r.json();
}

const cabeceras = { "Content-Type": "application/json" };

export const apiProductos = {
  listar: (buscar, categoria, orden) => {
    let ruta = "/productos";
    const params = [];
    if (buscar != "") {
      params.push("buscar=" + encodeURIComponent(buscar));
    }
    if (categoria != "" && categoria != "todas") {
      params.push("categoria=" + categoria);
    }
    if (orden != "") {
      params.push("orden=" + orden);
    }
    if (params.length > 0) {
      ruta = ruta + "?" + params.join("&");
    }
    return pedir(ruta);
  },

  crear: (producto) =>
    pedir("/productos", {
      method: "POST",
      headers: cabeceras,
      body: JSON.stringify(producto),
    }),

  actualizar: (id, producto) =>
    pedir("/productos/" + id, {
      method: "PUT",
      headers: cabeceras,
      body: JSON.stringify(producto),
    }),

  eliminar: (id) => pedir("/productos/" + id, { method: "DELETE" }),
};

export const apiResumen = {
  cargar: () => pedir("/resumen"),
};

export const apiCostos = {
  cargar: () => pedir("/costos"),
};

export const apiPedidos = {
  listar: () => pedir("/pedidos"),
  cambiarEstado: (id, estado) =>
    pedir("/pedidos/" + id + "/estado", {
      method: "PUT",
      headers: cabeceras,
      body: JSON.stringify({ estado }),
    }),
};

export const formatear = (valor) => "$" + Number(valor).toLocaleString("es-CL");
