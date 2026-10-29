import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/', (req, res) => {
  const pedidos = db.prepare('SELECT * FROM pedidos ORDER BY fecha DESC').all()

  const pedidosConDetalle = pedidos.map((pedido) => {
    const detalle = db.prepare(
      'SELECT * FROM pedido_detalle WHERE pedido_id = ?'
    ).all(pedido.id)
    return { ...pedido, detalle }
  })

  res.json(pedidosConDetalle)
})

router.put('/:id/estado', (req, res) => {
  const { estado } = req.body
  const existe = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(req.params.id)

  if (!existe) {
    return res.status(404).json({ error: 'Pedido no encontrado' })
  }

  db.prepare('UPDATE pedidos SET estado = ? WHERE id = ?').run(estado, req.params.id)
  const actualizado = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(req.params.id)
  res.json(actualizado)
})

router.get('/:id', (req, res) => {
  const pedido = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(req.params.id)
  if (!pedido) {
    return res.status(404).json({ error: 'Pedido no encontrado' })
  }

  const detalle = db.prepare('SELECT * FROM pedido_detalle WHERE pedido_id = ?').all(pedido.id)
  res.json({ ...pedido, detalle })
})

export default router
