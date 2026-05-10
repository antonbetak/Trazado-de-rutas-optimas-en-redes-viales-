# Servidor - API de rutas óptimas

## Integrantes

- Anton Betak Licea
- Argenis Emanuel Aragón Lopez
- Cristian Alexei Romero Martínez

Servicio REST construido con FastAPI, OSMnx y NetworkX.

## Instalación

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Ejecución

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

La documentación interactiva queda en:


> http://127.0.0.1:8000/docs

## Endpoints

| Metodo | Ruta             | Descripcion                               |
|--------|------------------|-------------------------------------------|
| `GET`  | `/estado`        | Verifica que la API este activa           |
| `POST` | `/ruta`          | Calcula ruta usando el algoritmo indicado |
| `POST` | `/ruta/dijkstra` | Calcula ruta con Dijkstra                 |
| `POST` | `/ruta/astar`    | Calcula ruta con A*                       |
| `POST` | `/ruta/k-rutas`  | Calcula multiples rutas alternativas      |

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

## Información comparativa de los algoritmos

| Algoritmo | Complejidad temporal | Espacio auxiliar | Notas                                            |
|-----------|----------------------|------------------|--------------------------------------------------|
| Dijkstra  | O((V + E) log V)     | O(V + E)         | No tan rápido, pero consistente.                 |
| A*        | O(E log V)           | O(V)             | Rápido, pero puede degenerarse en algunos casos. |
| K Rutas   | O(KV(E + V log V))   | o(K N) + V       | Lento, pero genera múltiples soluciones válidas. | 

Donde E = aristas, V = vertices y K = caminos.

#### Referencias

GeeksforGeeks (21 de enero de 2026) *Dijkstra's Algorithm*. https://www.geeksforgeeks.org/dsa/dijkstras-shortest-path-algorithm-greedy-algo-7/

GeeksforGeeks (23 de julio de 2025) *A\* Search Algorithm*. https://www.geeksforgeeks.org/dsa/a-search-algorithm/

Coudert, D., D'Ascenzo, A. y Rambaud, C. (2025).
k-shortest simple paths in bounded treewidth graphs, *Theoretical Computer Science*, 
1039(115182), ISSN 0304-3975, https://doi.org/10.1016/j.tcs.2025.115182.