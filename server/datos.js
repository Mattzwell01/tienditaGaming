import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import db from './db.js'

const carpetaServer = path.dirname(fileURLToPath(import.meta.url))
const archivoJson = path.join(carpetaServer, '..', 'src', 'Components', 'Productos', 'productos.json')

const stocks = [12, 8, 15, 6, 20, 40, 18, 25, 14, 30, 22, 9, 5, 7, 60, 45, 38, 55, 33, 70]

const factors = {
  consola: 0.72,
  periferico: 0.58,
  videojuego: 0.78
}

function calcularCosto(producto) {
  const factor = factors[producto.categoria] || 0.65
  return Math.round(producto.precio * factor)
}

export function sembrarProductos() {
  const cantidad = db.prepare('SELECT COUNT(*) as total FROM productos').get().total
  if (cantidad > 0) {
    return
  }

  const productos = JSON.parse(fs.readFileSync(archivoJson, 'utf-8'))
  const insertar = db.prepare(
    'INSERT INTO productos (nombre, descripcion, precio, costo, stock, categoria, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )

  productos.forEach((producto, i) => {
    insertar.run(
      producto.nombre,
      producto.descripcion,
      producto.precio,
      calcularCosto(producto),
      stocks[i] || 10,
      producto.categoria,
      producto.imagen
    )
  })
}

const clientes = [
  ['Camila Rojas', 'camila.rojas@correo.cl'],
  ['Ignacio Fuentes', 'ignacio.fuentes@correo.cl'],
  ['Javiera Molina', 'javiera.molina@correo.cl'],
  ['Benjamín Ortiz', 'benjamin.ortiz@correo.cl'],
  ['Florencia Pérez', 'florencia.perez@correo.cl'],
  ['Matías Contreras', 'matias.contreras@correo.cl']
]

const estados = ['pendiente', 'enviado', 'entregado', 'entregado', 'cancelado']

export function sembrarPedidos() {
  const cantidad = db.prepare('SELECT COUNT(*) as total FROM pedidos').get().total
  if (cantidad > 0) {
    return
  }

  const productos = db.prepare('SELECT id, nombre, precio, costo FROM productos').all()
  const insertarPedido = db.prepare(
    'INSERT INTO pedidos (cliente, email, fecha, estado, total) VALUES (?, ?, ?, ?, ?)'
  )
  const insertarDetalle = db.prepare(
    'INSERT INTO pedido_detalle (pedido_id, producto_id, nombre_producto, cantidad, precio_unitario, costo_unitario) VALUES (?, ?, ?, ?, ?, ?)'
  )

  for (let i = 0; i < 18; i++) {
    const cliente = clientes[i % clientes.length]
    const dia = (i % 27) + 1
    const mes = (i % 6) + 1
    const fecha = `2026-0${mes}-${String(dia).padStart(2, '0')} 12:30:00`
    const estado = estados[i % estados.length]

    const primero = productos[(i * 3) % productos.length]
    const segundo = productos[(i * 3 + 5) % productos.length]

    const detalle = [
      { producto: primero, cantidad: (i % 3) + 1 },
      { producto: segundo, cantidad: (i % 2) + 1 }
    ]

    let total = 0
    for (const linea of detalle) {
      total = total + linea.producto.precio * linea.cantidad
    }

    const info = insertarPedido.run(cliente[0], cliente[1], fecha, estado, total)
    const pedidoId = info.lastInsertRowid

    for (const linea of detalle) {
      insertarDetalle.run(
        pedidoId,
        linea.producto.id,
        linea.producto.nombre,
        linea.cantidad,
        linea.producto.precio,
        linea.producto.costo
      )
    }
  }
}

export function sembrarTodo() {
  sembrarProductos()
  sembrarPedidos()
}
