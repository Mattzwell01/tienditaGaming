import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {
  const totalProductos = db.prepare('SELECT COUNT(*) as total FROM productos').get().total
  const unidades = db.prepare('SELECT COALESCE(SUM(stock), 0) as total FROM productos').get().total
  const valorCosto = db.prepare('SELECT COALESCE(SUM(costo * stock), 0) as total FROM productos').get().total
  const valorPrecio = db.prepare('SELECT COALESCE(SUM(precio * stock), 0) as total FROM productos').get().total

  const ventas = db.prepare(
    "SELECT COALESCE(SUM(total), 0) as total FROM pedidos WHERE estado != 'cancelado'"
  ).get().total

  const costoVentas = db.prepare(
    `SELECT COALESCE(SUM(d.cantidad * d.costo_unitario), 0) as total
     FROM pedido_detalle d
     INNER JOIN pedidos p ON p.id = d.pedido_id
     WHERE p.estado != 'cancelado'`
  ).get().total

  const cantidadPedidos = db.prepare('SELECT COUNT(*) as total FROM pedidos').get().total
  const pedidosCancelados = db.prepare(
    "SELECT COUNT(*) as total FROM pedidos WHERE estado = 'cancelado'"
  ).get().total

  const bajoStock = db.prepare('SELECT * FROM productos WHERE stock <= 8 ORDER BY stock ASC LIMIT 6').all()

  const porCategoria = db.prepare(
    `SELECT categoria, COUNT(*) as cantidad, COALESCE(SUM(stock), 0) as unidades
     FROM productos GROUP BY categoria ORDER BY cantidad DESC`
  ).all()

  const ganancia = ventas - costoVentas

  res.json({
    totalProductos,
    unidades,
    valorCosto,
    valorPrecio,
    ventas,
    costoVentas,
    ganancia,
    margen: ventas > 0 ? (ganancia / ventas) * 100 : 0,
    cantidadPedidos,
    pedidosCancelados,
    bajoStock,
    porCategoria
  })
})

export default router
