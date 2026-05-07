# Rutas optimas con grafos viales reales

## Integrantes

- Anton Betak Licea
- Argenis Emanuel Aragón Lopez
- Alexei Romero Martinez

Aplicacion web para calcular y visualizar rutas rapidas entre dos puntos geograficos usando grafos de redes viales reales. El servidor usa FastAPI, OSMnx y NetworkX; la interfaz usa React y Leaflet.

## Caracteristicas

- Descarga de red vial real de una ciudad mexicana con OSMnx.
- Modelado de la red como grafo NetworkX.
- Calculo de rutas con Dijkstra, A* y k rutas mas cortas.
- Distancia total y tiempo estimado de recorrido.
- API REST documentada automaticamente en `/docs`.
- Mapa interactivo con seleccion por coordenadas o clic.

## Estructura

```text
.
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── routing.py
│   │   └── settings.py
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── package.json
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles.css
    └── vite.config.js
```

## Servidor

### Instalacion

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Ejecucion

```bash
fastapi dev app/main.py
```

Tambien puedes usar:

```bash
uvicorn app.main:app --reload
```

La API queda disponible en `http://127.0.0.1:8000`.

### Configuracion opcional

Variables de entorno soportadas:

| Variable | Valor por defecto | Descripcion |
|---|---:|---|
| `ROUTING_PLACE_NAME` | `Guadalajara, Jalisco, Mexico` | Ciudad a descargar desde OSMnx |
| `ROUTING_NETWORK_TYPE` | `drive` | Tipo de red vial |
| `ROUTING_DEFAULT_SPEED_KPH` | `40` | Velocidad usada cuando una arista no tiene velocidad |

La primera ejecucion puede tardar porque descarga la red vial. Despues se guarda cache en `backend/.cache/osmnx`.

## Endpoints

### `GET /estado`

Verifica el estado del servicio.

### `POST /ruta`

Calcula una ruta con el algoritmo seleccionado.

Solicitud:

```json
{
  "origen": { "lat": 20.6736, "lon": -103.344 },
  "destino": { "lat": 20.6597, "lon": -103.3496 },
  "algoritmo": "astar",
  "k": 3
}
```

Respuesta:

```json
{
  "algoritmo": "astar",
  "rutas": [
    {
      "coordenadas": [
        { "lat": 20.67354, "lon": -103.34404 },
        { "lat": 20.67012, "lon": -103.34628 }
      ],
      "distancia_m": 2145.8,
      "distancia_km": 2.146,
      "tiempo_estimado_min": 3.22
    }
  ]
}
```

### Endpoints por algoritmo

Tambien existen endpoints independientes:

- `POST /ruta/dijkstra`
- `POST /ruta/astar`
- `POST /ruta/k-rutas`

Ejemplo:

```bash
curl -X POST http://127.0.0.1:8000/ruta/dijkstra \
  -H "Content-Type: application/json" \
  -d '{
    "origen": { "lat": 20.6736, "lon": -103.344 },
    "destino": { "lat": 20.6597, "lon": -103.3496 }
  }'
```

## Interfaz

### Instalacion

```bash
cd frontend
npm install
```

### Ejecucion

```bash
npm run dev
```

La aplicacion queda disponible normalmente en `http://127.0.0.1:5173`.

## Entrega en GitHub

1. Crear un repositorio privado.
2. Subir este proyecto.
3. Compartir el repositorio con el usuario `pdanielvazquez`.

## Analisis algoritmico

- **Dijkstra** garantiza el camino mas corto con pesos no negativos. Es robusto, pero puede explorar muchas zonas del grafo.
- **A\*** usa una heuristica geografica basada en distancia euclidiana aproximada. En redes viales suele explorar menos nodos cuando la heuristica aproxima bien la direccion al destino.
- **k rutas mas cortas** devuelve varias alternativas ordenadas por costo. Es util para comparar rutas cercanas, aunque cuesta mas computacionalmente porque busca multiples caminos simples.
