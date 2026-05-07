# Integrantes:
# Anton Betak Licea
# Argenis Emanuel Aragón Lopez
# Alexei Romero Martinez

from enum import StrEnum
from typing import Annotated
from pydantic import BaseModel, Field


Latitud = Annotated[float, Field(ge=-90, le=90)]
Longitud = Annotated[float, Field(ge=-180, le=180)]


class Algoritmo(StrEnum):
    dijkstra = "dijkstra"
    astar = "astar"
    k_rutas = "k-shortest"


class Coordenada(BaseModel):
    lat: Latitud
    lon: Longitud


class SolicitudRuta(BaseModel):
    origen: Coordenada
    destino: Coordenada
    algoritmo: Algoritmo = Algoritmo.dijkstra
    k: int = Field(default=3, ge=1, le=5)


class SolicitudAlgoritmo(BaseModel):
    origen: Coordenada
    destino: Coordenada
    k: int = Field(default=3, ge=1, le=5)


class ResultadoRuta(BaseModel):
    coordenadas: list[Coordenada]
    distancia_m: float
    distancia_km: float
    tiempo_estimado_min: float


class RespuestaRuta(BaseModel):
    algoritmo: Algoritmo
    rutas: list[ResultadoRuta]
