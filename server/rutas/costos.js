import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {
  const productos = db.prepare('SELECT * FROM productos ORDER BY id ASC').all()

  const detalle = productos.map((producto) => {
    const margen = producto.precio - producto.costo
    const porcentaje = producto.precio > 0 ? (margen / producto.precio) * 100 : 0
    const unidadesVendidas = db.prepare(
      `SELECT COALESCE(SUM(d.cantidad), 0) as total
       FROM pedido_detalle d
       INNER JOIN pedidos p ON p.id = d.pedido_id
       WHERE d.producto_id = ? AND p.estado != 'cancelado'`
    ).get(producto.id).total

    return {
      id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      costo: producto.costo,
      stock: producto.stock,
      margen,
      porcentaje,
      unidadesVendidas,
      gananciaTotal: margen * unidadesVendidas
    }
  })

  const porCategoria = db.prepare(
    `SELECT categoria,
            COUNT(*) as cantidad,
            COALESCE(SUM(stock), 0) as unidades,
            COALESCE(SUM(precio * stock), 0) as valorPrecio,
            COALESCE(SUM(costo * stock), 0) as valorCosto
     FROM productos GROUP BY categoria ORDER BY categoria ASC`
  ).all()

  const totalCosto = db.prepare('SELECT COALESCE(SUM(costo * stock), 0) as total FROM productos').get().total
  const totalPrecio = db.prepare('SELECT COALESCE(SUM(precio * stock), 0) as total FROM productos').get().total

  res.json({
    productos: detalle,
    porCategoria,
    totalCosto,
    totalPrecio,
    utilidadInventario: totalPrecio - totalCosto
  })
})

export default router
