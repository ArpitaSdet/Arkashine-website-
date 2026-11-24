"""
Build a compact India boundary dataset (country outline + all state/UT boundaries)
from Natural Earth 1:50m admin-0 / admin-1 data (public domain — safe for commercial
use, no attribution required: https://www.naturalearthdata.com/about/terms-of-use/).

Output: public/data/india-geo.json
  {
    country: [ [ [lng,lat], ... ], ... ]   // rings (mainland + islands)
    states: { "Karnataka": [ [ [lng,lat], ...] , ... ], ... }
  }

Run from the project root:
    python -m pip install shapely
    python scripts/build_india_geo.py
"""
import json
import os
import urllib.request

from shapely.geometry import shape, mapping
from shapely import simplify

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "public", "data")
COUNTRIES_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson"
STATES_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.geojson"


def fetch(url, path):
    if not os.path.exists(path):
        print("downloading", url)
        urllib.request.urlretrieve(url, path)
    return json.load(open(path, encoding="utf-8"))


def rings_from_geom(geom, tol):
    g = simplify(geom, tolerance=tol, preserve_topology=True)
    m = mapping(g)
    polys = m["coordinates"] if m["type"] == "MultiPolygon" else [m["coordinates"]]
    out = []
    for poly in polys:
        exterior = poly[0]
        out.append([[round(x, 3), round(y, 3)] for x, y in exterior])
    return out


countries_path = os.path.join(DATA, "ne_countries_raw.geojson")
states_path = os.path.join(DATA, "ne_states_raw.geojson")

# ---- country outline ----
countries = fetch(COUNTRIES_URL, countries_path)
india_f = next(f for f in countries["features"] if f["properties"].get("ADMIN") == "India")
india_geom = shape(india_f["geometry"])
country_rings = rings_from_geom(india_geom, tol=0.01)
# keep mainland + the largest handful of island rings only (drop tiny noise rings)
country_rings.sort(key=len, reverse=True)
country_rings = [r for r in country_rings if len(r) >= 4][:40]

# ---- state boundaries ----
states_raw = fetch(STATES_URL, states_path)
india_states = [f for f in states_raw["features"] if f["properties"].get("admin") == "India"]

states_out = {}
for f in india_states:
    name = f["properties"]["name"]
    geom = shape(f["geometry"])
    tol = 0.006 if name == "Karnataka" else 0.012
    rings = rings_from_geom(geom, tol=tol)
    rings.sort(key=len, reverse=True)
    rings = [r for r in rings if len(r) >= 4][:6]
    states_out[name] = rings

out = {"country": country_rings, "states": states_out}
out_path = os.path.join(DATA, "india-geo.json")
with open(out_path, "w", encoding="utf-8") as fh:
    json.dump(out, fh, separators=(",", ":"))

size = os.path.getsize(out_path)
total_pts = sum(len(r) for r in country_rings) + sum(len(r) for rs in states_out.values() for r in rs)
print("wrote", out_path)
print("size_kb", round(size / 1024, 1), "points", total_pts, "states", len(states_out))
print("karnataka rings", [len(r) for r in states_out["Karnataka"]])
print("\nDelete the *_raw.geojson files in public/data/ now — they are not needed at runtime.")
