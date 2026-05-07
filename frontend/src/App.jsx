// Integrantes:
// Anton Betak Licea
// Argenis Emanuel Aragón Lopez
// Alexei Romero Martinez

import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { Loader2, MapPin, Route, RotateCcw } from 'lucide-react'

const URL_API = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'
const CENTRO_INICIAL = [20.6736, -103.344]

const algoritmos = [
  { valor: 'dijkstra', texto: 'Dijkstra' },
  { valor: 'astar', texto: 'A*' },
  { valor: 'k-shortest', texto: 'k rutas mas cortas' },
]

const coloresRuta = ['#0f766e', '#dc2626', '#2563eb', '#9333ea', '#ea580c']
const integrantes = ['Anton Betak Licea', 'Argenis Emanuel Aragón Lopez', 'Alexei Romero Martinez']

function datosIniciales() {
  return {
    origenLat: '20.6736',
    origenLon: '-103.3440',
    destinoLat: '20.6597',
    destinoLon: '-103.3496',
    algoritmo: 'dijkstra',
    k: 3,
  }
}

function coordenada(lat, lon) {
  return { lat: Number(lat), lon: Number(lon) }
}

export default function App() {
  const [formulario, setFormulario] = useState(datosIniciales)
  const [respuesta, setRespuesta] = useState(null)
  const [mensajeError, setMensajeError] = useState('')
  const [calculando, setCalculando] = useState(false)
  const [puntoActivo, setPuntoActivo] = useState('origen')
  const mapaRef = useRef(null)
  const puntoActivoRef = useRef('origen')
  const capasRef = useRef({ marcas: [], rutas: [] })

  const origen = useMemo(
    () => coordenada(formulario.origenLat, formulario.origenLon),
    [formulario.origenLat, formulario.origenLon],
  )
  const destino = useMemo(
    () => coordenada(formulario.destinoLat, formulario.destinoLon),
    [formulario.destinoLat, formulario.destinoLon],
  )

  useEffect(() => {
    puntoActivoRef.current = puntoActivo
  }, [puntoActivo])

  useEffect(() => {
    const mapa = L.map('mapa', { zoomControl: false }).setView(CENTRO_INICIAL, 13)
    L.control.zoom({ position: 'bottomright' }).addTo(mapa)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapa)

    mapa.on('click', (evento) => {
      const { lat, lng } = evento.latlng
      const punto = puntoActivoRef.current
      setFormulario((actual) => ({
        ...actual,
        [`${punto}Lat`]: lat.toFixed(6),
        [`${punto}Lon`]: lng.toFixed(6),
      }))
    })

    mapaRef.current = mapa
    return () => mapa.remove()
  }, [])

  useEffect(() => {
    if (!mapaRef.current) return
    const mapa = mapaRef.current
    capasRef.current.marcas.forEach((capa) => capa.remove())
    capasRef.current.marcas = []

    if (Number.isFinite(origen.lat) && Number.isFinite(origen.lon)) {
      capasRef.current.marcas.push(
        L.circleMarker([origen.lat, origen.lon], {
          color: '#ffffff',
          fillColor: '#0f766e',
          fillOpacity: 1,
          radius: 8,
          weight: 3,
        })
          .bindPopup('Origen')
          .addTo(mapa),
      )
    }

    if (Number.isFinite(destino.lat) && Number.isFinite(destino.lon)) {
      capasRef.current.marcas.push(
        L.circleMarker([destino.lat, destino.lon], {
          color: '#ffffff',
          fillColor: '#dc2626',
          fillOpacity: 1,
          radius: 8,
          weight: 3,
        })
          .bindPopup('Destino')
          .addTo(mapa),
      )
    }
  }, [origen, destino])

  useEffect(() => {
    if (!mapaRef.current) return
    const mapa = mapaRef.current
    capasRef.current.rutas.forEach((capa) => capa.remove())
    capasRef.current.rutas = []

    if (!respuesta?.rutas?.length) return

    const limites = []
    respuesta.rutas.forEach((ruta, indice) => {
      const puntos = ruta.coordenadas.map((punto) => [punto.lat, punto.lon])
      limites.push(...puntos)
      capasRef.current.rutas.push(
        L.polyline(puntos, {
          color: coloresRuta[indice % coloresRuta.length],
          weight: indice === 0 ? 6 : 4,
          opacity: indice === 0 ? 0.95 : 0.72,
          dashArray: indice === 0 ? null : '8 8',
        }).addTo(mapa),
      )
    })

    if (limites.length) {
      mapa.fitBounds(limites, { padding: [36, 36] })
    }
  }, [respuesta])

  function cambiarCampo(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }))
  }

  async function calcularRuta(evento) {
    evento.preventDefault()
    setCalculando(true)
    setMensajeError('')
    setRespuesta(null)

    try {
      const respuestaApi = await fetch(`${URL_API}/ruta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origen,
          destino,
          algoritmo: formulario.algoritmo,
          k: Number(formulario.k),
        }),
      })

      const datos = await respuestaApi.json()
      if (!respuestaApi.ok) {
        throw new Error(datos.detail ?? 'No fue posible calcular la ruta.')
      }
      setRespuesta(datos)
    } catch (errorPeticion) {
      setMensajeError(errorPeticion.message)
    } finally {
      setCalculando(false)
    }
  }

  function reiniciar() {
    setFormulario(datosIniciales())
    setRespuesta(null)
    setMensajeError('')
    mapaRef.current?.setView(CENTRO_INICIAL, 13)
  }

  return (
    <main className="pagina">
      <section className="panel" aria-label="Controles de ruta">
        <div className="encabezado-panel">
          <div>
            <p className="subtitulo">Proyecto de grafos</p>
            <h1>Rutas optimas</h1>
          </div>
          <button className="boton-icono" type="button" onClick={reiniciar} title="Reiniciar">
            <RotateCcw size={18} />
          </button>
        </div>

        <form onSubmit={calcularRuta} className="formulario-ruta">
          <div className="selector-punto" role="group" aria-label="Seleccion de punto por clic">
            <button
              className={puntoActivo === 'origen' ? 'activo' : ''}
              type="button"
              onClick={() => setPuntoActivo('origen')}
            >
              <MapPin size={16} />
              Origen
            </button>
            <button
              className={puntoActivo === 'destino' ? 'activo' : ''}
              type="button"
              onClick={() => setPuntoActivo('destino')}
            >
              <MapPin size={16} />
              Destino
            </button>
          </div>

          <div className="campos">
            <label>
              Latitud origen
              <input value={formulario.origenLat} onChange={(evento) => cambiarCampo('origenLat', evento.target.value)} />
            </label>
            <label>
              Longitud origen
              <input value={formulario.origenLon} onChange={(evento) => cambiarCampo('origenLon', evento.target.value)} />
            </label>
            <label>
              Latitud destino
              <input value={formulario.destinoLat} onChange={(evento) => cambiarCampo('destinoLat', evento.target.value)} />
            </label>
            <label>
              Longitud destino
              <input value={formulario.destinoLon} onChange={(evento) => cambiarCampo('destinoLon', evento.target.value)} />
            </label>
          </div>

          <label>
            Algoritmo
            <select value={formulario.algoritmo} onChange={(evento) => cambiarCampo('algoritmo', evento.target.value)}>
              {algoritmos.map((algoritmo) => (
                <option key={algoritmo.valor} value={algoritmo.valor}>
                  {algoritmo.texto}
                </option>
              ))}
            </select>
          </label>

          {formulario.algoritmo === 'k-shortest' && (
            <label>
              Numero de rutas
              <input
                type="number"
                min="1"
                max="5"
                value={formulario.k}
                onChange={(evento) => cambiarCampo('k', evento.target.value)}
              />
            </label>
          )}

          <button className="boton-principal" disabled={calculando} type="submit">
            {calculando ? <Loader2 className="girar" size={18} /> : <Route size={18} />}
            Calcular ruta
          </button>
        </form>

        {mensajeError && <p className="aviso error">{mensajeError}</p>}

        {respuesta && (
          <div className="resultados">
            <h2>{algoritmos.find((item) => item.valor === respuesta.algoritmo)?.texto}</h2>
            {respuesta.rutas.map((ruta, indice) => (
              <article className="tarjeta-ruta" key={`${ruta.distancia_m}-${indice}`}>
                <span className="color-ruta" style={{ background: coloresRuta[indice % coloresRuta.length] }} />
                <div>
                  <strong>Ruta {indice + 1}</strong>
                  <p>{ruta.distancia_km} km</p>
                  <p>{ruta.tiempo_estimado_min} min estimados</p>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="integrantes">
          <strong>Integrantes</strong>
          {integrantes.map((nombre) => (
            <span key={nombre}>{nombre}</span>
          ))}
        </div>
      </section>

      <section className="zona-mapa" aria-label="Mapa interactivo">
        <div id="mapa" />
      </section>
    </main>
  )
}
