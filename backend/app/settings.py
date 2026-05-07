# Integrantes:
# Anton Betak Licea
# Argenis Emanuel Aragón Lopez
# Alexei Romero Martinez

from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    place_name: str = "Guadalajara, Jalisco, Mexico"
    network_type: str = "drive"
    default_speed_kph: float = 40.0
    graph_cache_dir: Path = Path(".cache/osmnx")

    model_config = SettingsConfigDict(env_prefix="ROUTING_")


@lru_cache
def get_settings() -> Settings:
    return Settings()
