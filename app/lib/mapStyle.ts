export const MAP_CONFIG = {
  style: "mapbox://styles/mapbox/dark-v11",
  defaultCenter: [-6.5, 32.5] as [number, number],
  defaultZoom: 5.5,
  maxZoom: 18,
  minZoom: 2,
};

export const MAP_LAYER_OVERRIDES = {
  water: "#0d1b2a",
  land: "#111111",
  roads: "#1a1a1a",
  labels: "#f5f0e8",
  buildings: "#181818",
};

export function applyCustomStyle(map: mapboxgl.Map) {
  map.on("style.load", () => {
    // Water
    const waterLayers = ["water"];
    waterLayers.forEach((layer) => {
      if (map.getLayer(layer)) {
        map.setPaintProperty(layer, "fill-color", MAP_LAYER_OVERRIDES.water);
      }
    });

    // Land / background
    if (map.getLayer("land")) {
      map.setPaintProperty("land", "background-color", MAP_LAYER_OVERRIDES.land);
    }

    // Road layers
    const roadLayers = map
      .getStyle()
      .layers.filter((l) => l.id.includes("road"));
    roadLayers.forEach((layer) => {
      if (layer.type === "line") {
        map.setPaintProperty(layer.id, "line-color", MAP_LAYER_OVERRIDES.roads);
      }
    });

    // Building layers
    const buildingLayers = map
      .getStyle()
      .layers.filter((l) => l.id.includes("building"));
    buildingLayers.forEach((layer) => {
      if (layer.type === "fill") {
        map.setPaintProperty(
          layer.id,
          "fill-color",
          MAP_LAYER_OVERRIDES.buildings
        );
      }
    });
  });
}
