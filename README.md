# TienditaGaming

Tienda online de productos gaming hecha con React. La parte de la tienda ya estaba
armada y a esta se le sumo un **panel de administracion** que esta conectado a una
base de datos **SQLite**.

---

## 1. Como se ejecuta el proyecto

```bash
npm install
npm run dev
```

`npm run dev` levanta las dos partes juntas:

| Comando | Que hace | Puerto |
|---|---|---|
| `npm run dev` | Levanta Vite y el servidor de la API a la vez | 5173 |
| `npm run dev:cliente` | Solo el frontend (Vite) | 5173 |
| `npm run dev:server` | Solo el servidor de la API | 3000 |
| `npm run build` | Genera la version de produccion en `dist/` | - |
| `npm start` | Levanta el servidor que ademas sirve `dist/` | 3000 |
| `npm test` | Corre las pruebas unitarias | - |
| `npm run lint` | Revisa el codigo con oxlint | - |

La tienda se abre en `http://localhost:5173/` y el panel de administracion en
`http://localhost:5173/admin`.

En desarrollo Vite manda las peticiones que empiezan con `/api` al servidor de la
API, asi que el frontend siempre habla en el mismo origen (`/api/productos`, etc).

---

## 2. Estructura del proyecto

```
testTienditaGaming/
├── server/                  API y base de datos
│   ├── index.js             servidor Express
│   ├── db.js                crea el archivo SQLite y las tablas
│   ├── datos.js             carga los datos de ejemplo
│   └── rutas/
│       ├── productos.js     CRUD de productos
│       ├── costos.js        costo, margen y valorizacion
│       ├── pedidos.js       pedidos y detalle
│       └── resumen.js       metricas del panel
├── src/
│   ├── App.jsx              rutas de la aplicacion
│   ├── Components/
│   │   ├── Home/            tienda
│   │   ├── Navbar/          barra de navegacion
│   │   ├── ProductList/     listado, filtros y orden
│   │   ├── DetalleProducto/ ficha del producto
│   │   ├── Cart/            carrito
│   │   ├── CartContext/     estado global del carrito
│   │   ├── Search/          buscador
│   │   └── Admin/           panel de administracion (nuevo)
│   │       ├── Admin.jsx        menu lateral del panel
│   │       ├── Dashboard.jsx    resumen general
│   │       ├── AdminProductos.jsx  alta, edicion y baja de productos
│   │       ├── AdminCostos.jsx     costos, margen y ganancias
│   │       ├── AdminPedidos.jsx    pedidos y cambio de estado
│   │       ├── api.js             llamadas a la API
│   │       └── Admin.css          estilos del panel
│   └── Components/Productos/productos.json   catalogo de la tienda
├── tests/                   pruebas unitarias
├── karma.conf.cjs           configuracion de Karma
├── babel.config.cjs         configuracion de Babel
└── database/                archivo SQLite (se crea solo)
```

---

## 3. Panel de administracion

Es una seccion aparte de la tienda, se entra por el link **Admin** del menu o por
`/admin`. No se toco nada del codigo de la tienda, solo se agrego el link al menu.

El panel tiene cuatro paginas:

- **Resumen**: total de productos, unidades en stock, ventas, ganancia, margen,
  productos con poco stock y cantidad de productos por categoria.
- **Productos**: listado con buscador, filtro por categoria, orden por precio o
  stock y paginacion. Desde el formulario de al lado se puede agregar, editar y
  eliminar productos.
- **Costos**: valorizacion del inventario a costo y a precio, utilidad, costo de
  cada categoria y margen de cada producto.
- **Pedidos**: listado de pedidos, cambio del estado (pendiente, enviado,
  entregado, cancelado) y detalle de cada pedido.

### Diseño responsivo con Bootstrap

El panel usa **Bootstrap 5** para el grid, las tablas, los formularios y los
botones. El CSS de Bootstrap se carga solamente cuando se entra al panel, para que
la tienda no cambie en nada. El grid se adapta con las clases de Bootstrap
(`col-12`, `col-md-6`, `col-lg-3`, `col-xl-8`, `table-responsive`), y el menu
lateral se acomoda solo en pantallas chicas.

---

## 4. Base de datos SQLite

La base se crea sola en `database/tienditagaming.db` la primera vez que se levanta
el servidor, junto con las tablas `productos`, `pedidos` y `pedido_detalle`. Si la
base esta vacia se cargan los 20 productos del catalogo y 18 pedidos de ejemplo.

Se usa **better-sqlite3**, que es el driver sincrono de SQLite para Node.

### Endpoints de la API

| Metodo | Ruta | Que hace |
|---|---|---|
| GET | `/api/productos` | Lista los productos, acepta `buscar`, `categoria` y `orden` |
| GET | `/api/productos/:id` | Un producto por id |
| POST | `/api/productos` | Crea un producto |
| PUT | `/api/productos/:id` | Actualiza un producto |
| DELETE | `/api/productos/:id` | Elimina un producto |
| GET | `/api/resumen` | Metricas del panel |
| GET | `/api/costos` | Costos y margenes |
| GET | `/api/pedidos` | Pedidos con su detalle |
| PUT | `/api/pedidos/:id/estado` | Cambia el estado de un pedido |

---

## 5. Pruebas unitarias (Jasmine + Karma)

### 5.1 Configuracion del entorno

- **Jasmine** es el framework de pruebas y **Karma** el runner que las ejecuta.
- El navegador es **Chrome Headless**, que se baja solo con Puppeteer
  (`npm install` ya lo deja listo en la cache).
- **Webpack** se encarga de armar el bundle de las pruebas y **Babel** transpila
  JSX y los `import` para que el navegador entienda el codigo.
- `@testing-library/react` ayuda a renderizar los componentes y consultar el DOM.

Los archivos de configuracion son:

| Archivo | Para que sirve |
|---|---|
| `karma.conf.cjs` | Configura Karma, Webpack, el launcher de Chrome y el reporte de cobertura |
| `babel.config.cjs` | Presets de Babel para los tests |
| `karma.instrumentador.cjs` | Instrumenta los archivos de `src/` para medir la cobertura |
| `tests/*.spec.jsx` | Las pruebas, una por archivo |

### 5.2 Pruebas escritas

| Archivo | Componente | Que verifica |
|---|---|---|
| `ProductList.spec.jsx` | ProductList | Muestra los 20 productos del JSON, filtra por categoria, ordena por precio y busca por nombre |
| `CartContext.spec.jsx` | CartContext | Agrega productos, suma la cantidad si ya existe y elimina productos |
| `Cart.spec.jsx` | Cart | Muestra el carrito vacio y calcula subtotal, envio y total |
| `DetalleProducto.spec.jsx` | DetalleProducto | Muestra el producto segun el id de la URL y el aviso cuando no existe |
| `Search.spec.jsx` | Search | Avisa el termino que se escribe |
| `AdminProductos.spec.jsx` | AdminProductos | Carga los productos desde la API |

Son **14 pruebas** en total, repartidas en 6 archivos.

### 5.3 Uso de mocks

- En `AdminProductos.spec.jsx` se reemplaza `window.fetch` con `spyOn` para
  simular la respuesta del servidor y no depender de la base de datos real.
- En `Search.spec.jsx` se usa `jasmine.createSpy` para revisar que se avise el
  termino buscado.
- El `useParams` de React Router no se mockea: en `DetalleProducto.spec.jsx` se usa
  `MemoryRouter` con una ruta de prueba, asi se prueba la URL de verdad.

### 5.4 Analisis de resultados y cobertura

Cada vez que se corre `npm test` se muestra el resumen de la cobertura:

```
Statements   : 59.06% ( 114/193 )
Branches     : 55.22% (  37/67 )
Functions    : 42.85% (  33/77 )
Lines        : 58.01% ( 105/181 )
```

El reporte completo en HTML queda en `coverage/index.html`, y el archivo
`coverage/lcov.info` sirve para subir la cobertura a un servicio como
Coveralls o Codecov.

### 5.5 Alcance de las pruebas

- **Cubierto**: el listado de productos con sus filtros, orden y busqueda, el
  contexto del carrito con sus tres operaciones, el calculo de totales del
  carrito, la ficha de producto segun la URL, el buscador y la carga de productos
  del panel de administracion.
- **No cubierto**: la validacion de los formularios del panel, el borrado y la
  edicion de productos desde la interfaz, el cambio de estado de un pedido y los
  calculos de la base de datos (se probarian con pruebas de integracion).
# tienditaGaming
