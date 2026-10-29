import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { sembrarTodo } from './datos.js'
import rutasProductos from './rutas/productos.js'
import rutasPedidos from './rutas/pedidos.js'
import rutasResumen from './rutas/resumen.js'
import rutasCostos from './rutas/costos.js'

const carpetaServer = path.dirname(fileURLToPath(import.meta.url))
const carpetaRaiz = path.join(carpetaServer, '..')

sembrarTodo()

const app = express()
const puerto = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api/salud', (req, res) => {
  res.json({ estado: 'ok', mensaje: 'Servidor de TienditaGaming funcionando' })
})

app.use('/api/productos', rutasProductos)
app.use('/api/pedidos', rutasPedidos)
app.use('/api/resumen', rutasResumen)
app.use('/api/costos', rutasCostos)

const carpetaBuild = path.join(carpetaRaiz, 'dist')

if (fs.existsSync(carpetaBuild)) {
  app.use(express.static(carpetaBuild))
  app.use((req, res, next) => {
    if (req.method != 'GET') {
      return next()
    }
    res.sendFile(path.join(carpetaBuild, 'index.html'))
  })
}

app.listen(puerto, () => {
  console.log('Servidor TienditaGaming escuchando en el puerto ' + puerto)
})
