import React, { useState } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Typography } from "@mui/material";

const FilterMap = ({ catchData, props  }) => {
  const [popupInfo, setPopupInfo] = useState(null);
  const [viewMode, setViewMode] = useState(props.type); // 'markers', 'heatmap', 'clusters'

  console.log(catchData);

  const heatmapData = {
      type: "FeatureCollection",
      features: catchData.map((catchDetail) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [catchDetail.longitude, catchDetail.latitude],
          },
          properties: {
            depth: catchDetail.depth,
            weight: catchDetail.totalCatchWeight,
          },
        }))
  }

  const heatmapLayer = {
    id: "heatmap-layer",
    type: "heatmap",
    source: "heatmap",
    paint: {
      "heatmap-weight": ["interpolate", ["linear"], ["get", "weight"], 0, 0, 10, 1],
      "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(0, 0, 255, 0)",
        0.2,
        "rgb(0, 128, 255)",
        0.4,
        "rgb(0, 255, 128)",
        0.6,
        "rgb(255, 255, 0)",
        0.8,
        "rgb(255, 128, 0)",
        1,
        "rgb(255, 0, 0)",
      ],
      "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 5, 9, 30],
      "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0.8, 9, 0.6],
    },
  };

  const clusterLayer = {
    id: "clusters",
    type: "circle",
    source: "heatmap",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#a7f542", // Light Green
        10,
        "#f5d742", // Yellow
        30,
        "#f54242", // Red
      ],
      "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 30],
      "circle-opacity": 0.8,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  };

  const clusterCountLayer = {
    id: "cluster-count",
    type: "symbol",
    source: "heatmap",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 14,
      "text-anchor": "center",
      "text-offset": [0, 0.5],
    },
    paint: {
      "text-color": "#ffffff",
      "text-halo-color": "#0066cc",
      "text-halo-width": 1.5,
    },
  };

  const unclusteredPointLayer = {
    id: "unclustered-point",
    type: "circle",
    source: "heatmap",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#ff6666",
      "circle-radius": 8,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
      "circle-opacity": 0.9,
    },
  };

  

  return (
    <div>
      {props.showButton && (
        <div style={{ position: "absolute", zIndex: 20, paddingLeft: "2rem" }}>
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => setViewMode("markers")}
              style={{
                padding: "3px 8px",
                background: viewMode === "markers" ? "#007bff" : "#ccc",
                color: viewMode === "markers" ? "#fff" : "#000",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
        Markers
            </button>
            <button
              onClick={() => setViewMode("heatmap")}
              style={{
                padding: "3px 8px",
                background: viewMode === "heatmap" ? "#007bff" : "#ccc",
                color: viewMode === "heatmap" ? "#fff" : "#000",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
               Heatmap
            </button>
            <button
              onClick={() => setViewMode("clusters")}
              style={{
                padding: "3px 8px",
                background: viewMode === "clusters" ? "#007bff" : "#ccc",
                color: viewMode === "clusters" ? "#fff" : "#000",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Clusters
            </button>
          </div>
        </div>
      )}

      <Map
        initialViewState={{
          latitude: 18.45,
          longitude: 84.431,
          zoom: 7,
        }}
        style={{
          borderRadius: "1rem",
          height: !props.showButton ? "20vh" : "45vh",
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken="pk.eyJ1Ijoic25laGFkMjgiLCJhIjoiY2x0czZid3AzMG42YzJqcGNmdzYzZmd2NSJ9.BuBkmVXS61pvHErosbGCGA"
      >

   `{!props.oneLat && !props.oneLong && viewMode === "markers" &&
  catchData.map((catchDetail) => (
    !isNaN(catchDetail.latitude) &&
    !isNaN(catchDetail.longitude) && (
      <Marker
        key={catchDetail._id}
        longitude={catchDetail.longitude}
        latitude={catchDetail.latitude}
        anchor="bottom"
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setPopupInfo(catchDetail);
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 0, 0, 0.8)",
            border: "2px solid white",
            borderRadius: "50%",
            width: "12px",
            height: "12px",
            boxShadow: "0 0 10px rgba(255, 0, 0, 0.5)",
            cursor: "pointer",
          }}
        ></div>
      </Marker>
    )
  ))
}
`

        {viewMode === "heatmap" && (
          <Source id="heatmap" type="geojson" data={heatmapData}>
            <Layer {...heatmapLayer} />
          </Source>
        )}

        {viewMode === "clusters" && (
          <Source
            id="heatmap"
            type="geojson"
            data={heatmapData}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
          >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointLayer} />
          </Source>
        )}

        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="top"
            onClose={() => setPopupInfo(null)}
            style={{
              borderRadius: "10px",
              padding: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              maxWidth: "300px",
            }}
          >
            <div style={{ fontFamily: "'Roboto', sans-serif" }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Details</h3>
              <p style={{ margin: "0 0 5px 0", color: "#555" }}>
                <strong>Latitude:</strong> {popupInfo.latitude}
              </p>
              <p style={{ margin: "0 0 5px 0", color: "#555" }}>
                <strong>Longitude:</strong> {popupInfo.longitude}
              </p>
              <p style={{ margin: "0 0 5px 0", color: "#555" }}>
                <strong>Depth:</strong> {popupInfo.depth} meters
              </p>
              <p style={{ margin: "0 0 5px 0", color: "#555" }}>
                <strong>Weight:</strong> {popupInfo.totalCatchWeight} kg
              </p>
              <p style={{ margin: "0", color: "#555" }}>
                <strong>Species:</strong> {popupInfo.species}
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default FilterMap;