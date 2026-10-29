import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {
  const buscar = req.query.buscar || ''
  const categoria = req.query.categoria || ''
  const orden = req.query.orden || 'id'

  let sql = 'SELECT * FROM productos WHERE 1=1'
  const argumentos = []

  if (buscar != '') {
    sql = sql + ' AND (nombre LIKE ? OR descripcion LIKE ?)'
    argumentos.push('%' + buscar + '%', '%' + buscar + '%')
  }

  if (categoria != '' && categoria != 'todas') {
    sql = sql + ' AND categoria = ?'
    argumentos.push(categoria)
  }

  if (orden == 'precio') {
    sql = sql + ' ORDER BY precio ASC'
  } else if (orden == 'precio_desc') {
    sql = sql + ' ORDER BY precio DESC'
  } else if (orden == 'stock') {
    sql = sql + ' ORDER BY stock ASC'
  } else {
    sql = sql + ' ORDER BY id ASC'
  }

  const productos = db.prepare(sql).all(...argumentos)
  res.json(productos)
})

router.get('/:id', (req, res) => {
  const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id)
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' })
  }
  res.json(producto)
})

router.post('/', (req, res) => {
  const { nombre, descripcion, precio, costo, stock, categoria, imagen } = req.body

  if (!nombre || precio == null) {
    return res.status(400).json({ error: 'El nombre y el precio son obligatorios' })
  }

  const info = db.prepare(
    'INSERT INTO productos (nombre, descripcion, precio, costo, stock, categoria, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    nombre,
    descripcion || '',
    Number(precio),
    Number(costo) || 0,
    Number(stock) || 0,
    categoria || 'consola',
    imagen || ''
  )

  const nuevo = db.prepare('SELECT * FROM productos WHERE id = ?').get(info.lastInsertRowid)
  res.status(201).json(nuevo)
})

router.put('/:id', (req, res) => {
  const existe = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id)
  if (!existe) {
    return res.status(404).json({ error: 'Producto no encontrado' })
  }

  const { nombre, descripcion, precio, costo, stock, categoria, imagen } = req.body

  db.prepare(
    'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, costo = ?, stock = ?, categoria = ?, imagen = ? WHERE id = ?'
  ).run(
    nombre != undefined ? nombre : existe.nombre,
    descripcion != undefined ? descripcion : existe.descripcion,
    precio != undefined ? Number(precio) : existe.precio,
    costo != undefined ? Number(costo) : existe.costo,
    stock != undefined ? Number(stock) : existe.stock,
    categoria != undefined ? categoria : existe.categoria,
    imagen != undefined ? imagen : existe.imagen,
    req.params.id
  )

  const actualizado = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id)
  res.json(actualizado)
})

router.delete('/:id', (req, res) => {
  const existe = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id)
  if (!existe) {
    return res.status(404).json({ error: 'Producto no encontrado' })
  }

  const pedido = db.prepare('SELECT COUNT(*) as total FROM pedido_detalle WHERE producto_id = ?').get(req.params.id)
  if (pedido.total > 0) {
    db.prepare('UPDATE productos SET stock = 0 WHERE id = ?').run(req.params.id)
    return res.json({ mensaje: 'El producto tiene pedidos asociados, se dejo sin stock' })
  }

  db.prepare('DELETE FROM productos WHERE id = ?').run(req.params.id)
  res.json({ mensaje: 'Producto eliminado' })
})

export default router
