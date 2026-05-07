# Servidor - API de rutas optimas

## Integrantes

- Anton Betak Licea
- Argenis Emanuel Aragón Lopez
- Alexei Romero Martinez

Servicio REST construido con FastAPI, OSMnx y NetworkX.

## Instalacion

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Ejecucion

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

La documentacion interactiva queda en:

```text
http://127.0.0.1:8000/docs
```

## Endpoints

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/estado` | Verifica que la API este activa |
| `POST` | `/ruta` | Calcula ruta usando el algoritmo indicado |
| `POST` | `/ruta/dijkstra` | Calcula ruta con Dijkstra |
| `POST` | `/ruta/astar` | Calcula ruta con A* |
| `POST` | `/ruta/k-rutas` | Calcula multiples rutas alternativas |

## Ejemplo de solicitud

```json
{
  "origen": { "lat": 20.6736, "lon": -103.3440 },
  "destino": { "lat": 20.6597, "lon": -103.3496 },
  "algoritmo": "astar",
  "k": 3
}
```

## Ejemplo de respuesta

```json
{
  "algoritmo": "astar",
  "rutas": [
    {
      "coordenadas": [
        { "lat": 20.6737624, "lon": -103.3439968 }
      ],
      "distancia_m": 1808.72,
      "distancia_km": 1.809,
      "tiempo_estimado_min": 1.7
    }
  ]
}
```

## Validaciones

- Latitud entre `-90` y `90`.
- Longitud entre `-180` y `180`.
- `k` entre `1` y `5`.
- Manejo de error cuando no existe ruta.
