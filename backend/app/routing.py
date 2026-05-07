# Integrantes:
# Anton Betak Licea
# Argenis Emanuel Aragón Lopez
# Alexei Romero Martinez

from functools import lru_cache
from pathlib import Path
from typing import Iterable

import networkx as nx
import osmnx as ox

from app.models import Algoritmo, Coordenada, ResultadoRuta
from app.settings import get_settings


PESO_TIEMPO = "travel_time"


def preparar_osmnx() -> None:
    configuracion = get_settings()
    carpeta_cache = Path(configuracion.graph_cache_dir)
    carpeta_cache.mkdir(parents=True, exist_ok=True)
    ox.settings.use_cache = True
    ox.settings.cache_folder = str(carpeta_cache)
    ox.settings.log_console = False


@lru_cache(maxsize=1)
def cargar_grafo() -> nx.MultiDiGraph:
    preparar_osmnx()
    configuracion = get_settings()
    grafo = ox.graph_from_place(
        configuracion.place_name,
        network_type=configuracion.network_type,
        simplify=True,
    )
    grafo = ox.add_edge_speeds(grafo, fallback=configuracion.default_speed_kph)
    grafo = ox.add_edge_travel_times(grafo)
    return grafo


def nodo_mas_cercano(grafo: nx.MultiDiGraph, punto: Coordenada) -> int:
    return ox.distance.nearest_nodes(grafo, X=punto.lon, Y=punto.lat)


def coordenadas_de_ruta(grafo: nx.MultiDiGraph, camino: list[int]) -> list[Coordenada]:
    return [
        Coordenada(lat=float(grafo.nodes[nodo]["y"]), lon=float(grafo.nodes[nodo]["x"]))
        for nodo in camino
    ]


def metrica_arista(grafo: nx.MultiDiGraph, u: int, v: int, metrica: str) -> float:
    datos_arista = grafo.get_edge_data(u, v)
    if not datos_arista:
        return 0.0
    return min(float(datos.get(metrica, 0.0)) for datos in datos_arista.values())


def metrica_camino(grafo: nx.MultiDiGraph, camino: Iterable[int], metrica: str) -> float:
    nodos = list(camino)
    return sum(metrica_arista(grafo, u, v, metrica) for u, v in zip(nodos[:-1], nodos[1:]))


def armar_resultado(grafo: nx.MultiDiGraph, camino: list[int]) -> ResultadoRuta:
    distancia_m = metrica_camino(grafo, camino, "length")
    tiempo_segundos = metrica_camino(grafo, camino, PESO_TIEMPO)
    return ResultadoRuta(
        coordenadas=coordenadas_de_ruta(grafo, camino),
        distancia_m=round(distancia_m, 2),
        distancia_km=round(distancia_m / 1000, 3),
        tiempo_estimado_min=round(tiempo_segundos / 60, 2),
    )


def heuristica_astar(grafo: nx.MultiDiGraph):
    def heuristica(u: int, v: int) -> float:
        datos_u = grafo.nodes[u]
        datos_v = grafo.nodes[v]
        distancia_m = ox.distance.great_circle(
            datos_u["y"],
            datos_u["x"],
            datos_v["y"],
            datos_v["x"],
        )
        velocidad_maxima_mps = 90 / 3.6
        return distancia_m / velocidad_maxima_mps

    return heuristica


def calcular_rutas(
    origen: Coordenada,
    destino: Coordenada,
    algoritmo: Algoritmo,
    k: int = 3,
) -> list[ResultadoRuta]:
    grafo = cargar_grafo()
    nodo_origen = nodo_mas_cercano(grafo, origen)
    nodo_destino = nodo_mas_cercano(grafo, destino)

    if nodo_origen == nodo_destino:
        return [armar_resultado(grafo, [nodo_origen])]

    try:
        if algoritmo == Algoritmo.dijkstra:
            camino = nx.shortest_path(
                grafo,
                nodo_origen,
                nodo_destino,
                weight=PESO_TIEMPO,
                method="dijkstra",
            )
            caminos = [camino]
        elif algoritmo == Algoritmo.astar:
            camino = nx.astar_path(
                grafo,
                nodo_origen,
                nodo_destino,
                heuristic=heuristica_astar(grafo),
                weight=PESO_TIEMPO,
            )
            caminos = [camino]
        else:
            grafo_simple = ox.convert.to_digraph(grafo, weight=PESO_TIEMPO)
            generador = nx.shortest_simple_paths(
                grafo_simple,
                nodo_origen,
                nodo_destino,
                weight=PESO_TIEMPO,
            )
            caminos = [camino for _, camino in zip(range(k), generador)]
    except (nx.NetworkXNoPath, nx.NodeNotFound) as exc:
        raise ValueError("No se encontro una ruta entre los puntos seleccionados.") from exc

    return [armar_resultado(grafo, camino) for camino in caminos]
