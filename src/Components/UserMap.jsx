import React, { useState } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const UserMapVisualization = ({ catchData, props, userId }) => {
  const [popupInfo, setPopupInfo] = useState(null);
  const [viewMode, setViewMode] = useState(props.type); // 'markers', 'heatmap', 'clusters'

  // Filter data for the specific user
  const userCatchData = catchData.filter((data) => data.userId === userId);

  // Prepare heatmap data
  const heatmapData = {
    type: "FeatureCollection",
    features: userCatchData.flatMap((data) =>
      data.catches.map((catchDetail) => ({
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
    ),
  };

  // Heatmap Layer
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

  return (
    <Map
      initialViewState={{
        latitude: props.oneLat || 18.45,
        longitude: props.oneLong || 84.431,
        zoom: 7,
      }}
      style={{
        borderRadius: "1rem",
        height: "45vh",
      }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken="your-mapbox-token"
    >
      {viewMode === "markers" &&
        userCatchData.flatMap((data) =>
          data.catches.map((catchDetail) => (
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
          ))
        )}

      {viewMode === "heatmap" && (
        <Source id="heatmap" type="geojson" data={heatmapData}>
          <Layer {...heatmapLayer} />
        </Source>
      )}

      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          anchor="top"
          onClose={() => setPopupInfo(null)}
        >
          <div>
            <h3>Details</h3>
            <p><strong>Latitude:</strong> {popupInfo.latitude.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {popupInfo.longitude.toFixed(6)}</p>
            <p><strong>Depth:</strong> {popupInfo.depth} meters</p>
            <ul>
              {popupInfo.species.map((s) => (
                <li key={s.name}>
                  {s.name}: {s.catch_weight} kg
                </li>
              ))}
            </ul>
          </div>
        </Popup>
      )}
    </Map>
  );
};

export default UserMapVisualization;
