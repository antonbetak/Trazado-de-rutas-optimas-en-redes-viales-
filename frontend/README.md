# Interfaz - Visualizador de rutas

## Integrantes

- Anton Betak Licea
- Argenis Emanuel Aragón Lopez
- Cristian Alexei Romero Martínez

Aplicación React con Leaflet para visualizar rutas óptimas sobre un mapa interactivo.

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

La aplicación queda disponible en:

> http://127.0.0.1:5173

## Uso

1. Escribir latitud y longitud de origen.
2. Escribir latitud y longitud de destino.
3. Elegir algoritmo: Dijkstra, A* o *k rutas más cortas*.
4. Si se usa *k rutas más cortas*, elegir el número de rutas.
5. Presionar `Calcular ruta`.
6. Revisar distancia y tiempo estimado en el panel.

También se puede seleccionar si el siguiente
clic en el mapa modifica el origen o el destino.

## Capturas seleccionadas para la entrega

Capturas de pantalla:

- `frontend-dijkstra.png`: ruta calculada con Dijkstra.
![frontend-dijkstra.png](../docs/frontend-dijkstra.png)
- `frontend-astar.png`: ruta calculada con A*.
![frontend-astar.png](../docs/frontend-astar.png)
- `frontend-k-rutas.png`: multiples rutas alternativas.
![frontend-k-rutas.png](../docs/frontend-k-routes.png)
- `swagger-docs.png`: documentación automática de FastAPI en `/docs`.
![swagger-docs.png](../docs/swagger-docs.png)

## Variables de entorno

Si el backend corre en otra URL, crear un archivo `.env` en `frontend/`:

```bash
VITE_API_URL=http://127.0.0.1:8000
```
