# Integrantes:
# Anton Betak Licea
# Argenis Emanuel Aragón Lopez
# Alexei Romero Martinez

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import Algoritmo, RespuestaRuta, SolicitudAlgoritmo, SolicitudRuta
from app.routing import calcular_rutas
from app.settings import get_settings


app = FastAPI(
    title="API de rutas optimas",
    description=(
        "Calculo de rutas con Dijkstra, A* y k rutas mas cortas sobre redes viales reales. "
        "Integrantes: Anton Betak Licea, Argenis Emanuel Aragón Lopez, Alexei Romero Martinez."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/estado")
def estado() -> dict[str, str]:
    configuracion = get_settings()
    return {"estado": "ok", "ciudad": configuracion.place_name}


@app.post("/ruta", response_model=RespuestaRuta)
def ruta(solicitud: SolicitudRuta) -> RespuestaRuta:
    return resolver_ruta(solicitud.origen, solicitud.destino, solicitud.algoritmo, solicitud.k)


@app.post("/ruta/dijkstra", response_model=RespuestaRuta)
def ruta_dijkstra(solicitud: SolicitudAlgoritmo) -> RespuestaRuta:
    return resolver_ruta(solicitud.origen, solicitud.destino, Algoritmo.dijkstra, solicitud.k)


@app.post("/ruta/astar", response_model=RespuestaRuta)
def ruta_astar(solicitud: SolicitudAlgoritmo) -> RespuestaRuta:
    return resolver_ruta(solicitud.origen, solicitud.destino, Algoritmo.astar, solicitud.k)


@app.post("/ruta/k-rutas", response_model=RespuestaRuta)
def ruta_k_caminos(solicitud: SolicitudAlgoritmo) -> RespuestaRuta:
    return resolver_ruta(solicitud.origen, solicitud.destino, Algoritmo.k_rutas, solicitud.k)


def resolver_ruta(origen, destino, algoritmo: Algoritmo, k: int) -> RespuestaRuta:
    try:
        rutas = calcular_rutas(origen, destino, algoritmo, k)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="No fue posible calcular la ruta.") from exc

    return RespuestaRuta(algoritmo=algoritmo, rutas=rutas)
