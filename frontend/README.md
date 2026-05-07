# Interfaz - Visualizador de rutas

## Integrantes

- Anton Betak Licea
- Argenis Emanuel Aragón Lopez
- Alexei Romero Martinez

Aplicacion React con Leaflet para visualizar rutas optimas sobre un mapa interactivo.

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm run dev
```

La aplicacion queda disponible en:

```text
http://127.0.0.1:5173
```

## Uso

1. Escribir latitud y longitud de origen.
2. Escribir latitud y longitud de destino.
3. Elegir algoritmo: Dijkstra, A* o k rutas mas cortas.
4. Si se usa k rutas mas cortas, elegir el numero de rutas.
5. Presionar `Calcular ruta`.
6. Revisar distancia y tiempo estimado en el panel.

Tambien se puede seleccionar si el siguiente clic en el mapa modifica el origen o el destino.

## Capturas sugeridas para entrega

Guarda capturas antes de entregar:

- `frontend-dijkstra.png`: ruta calculada con Dijkstra.
- `frontend-astar.png`: ruta calculada con A*.
- `interfaz-k-rutas.png`: multiples rutas alternativas.
- `swagger-docs.png`: documentacion automatica de FastAPI en `/docs`.

## Variables de entorno

Si el backend corre en otra URL, crear un archivo `.env` en `frontend/`:

```bash
VITE_API_URL=http://127.0.0.1:8000
```
