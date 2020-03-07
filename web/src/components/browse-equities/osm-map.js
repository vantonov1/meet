import React, {Component} from "react";
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from "ol/style";
import {Cluster, OSM, Vector as VectorSource} from "ol/source";
import {Tile, Vector} from "ol/layer";
import View from "ol/View";
import Map from "ol/Map"
import Geolocation from "ol/Geolocation";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Icon from "ol/style/Icon";
import Place from "./place-24px.svg"
import {fromLonLat, toLonLat} from "ol/proj";

class OsmMap extends Component {
    static ref = React.createRef();

    constructor(props) {
        super(props);
        this.source = new VectorSource({
            features: []
        });
        this.markerSource = new VectorSource({
            features: []
        });
        this.mounted = false;
    }

    componentDidMount() {
        let map = renderMap(this.source, this.markerSource);
        map.on('click', e => {
            if (this.props.onPick) {
                map.getView().setCenter(e.coordinate);
                this.props.onPick(toLonLat(e.coordinate));
                map.getView().setZoom(map.getView().getZoom() + 2)
            } else {
                map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
                    map.getView().setCenter(feature.get("geometry").flatCoordinates);
                    if (this.props.onLocationsSelect !== undefined) {
                        this.props.onLocationsSelect(feature.get('features').map(feature => feature.getId()))
                    }
                });
            }
        });
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (<div id="map" className={this.props.className}/>)
    }

    static setupClusters(locations) {
        let map = this.ref.current;
        if (map.mounted) {
            map.source.clear();
            if (locations)
                map.source.addFeatures(locations.map(l => toFeature(l)));
        }
    }

    static placeMarker(lon, lat) {
        let map = this.ref.current;
        if (map.mounted) {
            map.markerSource.clear();
            if (lon && lat)
                map.markerSource.addFeature(createMarkerFeature(lon, lat));
        }
    }
}

export default OsmMap

function createMarkerFeature(lon, lat) {
    const iconFeature = new Feature({
        geometry: new Point(fromLonLat([lon, lat])),
    });

    const icon = new Icon({
        anchor: [0.5, 0.75],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: Place,
    });

    iconFeature.setStyle(new Style({
        image: icon
    }));

    return iconFeature;
}

function renderMap(clustersSource, markerSource) {

    let view = new View({
        center: fromLonLat([30.3064796, 59.9374987]),
        zoom: 12
    });

    let tiles = new Tile({
        source: new OSM(),
        tileOptions: {crossOriginKeyword: 'anonymous'}
    });

    let clusters = new Vector({
        source: new Cluster({
            distance: 30,
            source: clustersSource,
        }),
        style: (feature) => clusterStyle(feature)
    });

    let position = new Vector({
        source: new VectorSource({
            features: [(createPositionFeature(view))]
        })
    });

    let marker = new Vector({
        source: markerSource
    });

    return new Map({
        layers: [tiles, clusters, position, marker],
        target: 'map',
        view: view
    });
}

function toFeature(location) {
    let feature = new Feature({
        geometry: new Point(fromLonLat([location.lon, location.lat]))
    });
    feature.setId(location.id);
    return feature
}

const styleCache = {};

function style(text) {
    let style = styleCache[text];
    if (!style) {
        style = new Style({
            image: new CircleStyle({
                radius: 10,
                stroke: new Stroke({
                    color: '#fff'
                }),
                fill: new Fill({
                    color: '#3399CC'
                })
            }),
            text: new Text({
                text: text.toString(),
                fill: new Fill({
                    color: '#fff'
                })
            })
        });
        styleCache[text] = style;
    }
    return style;
}

function clusterStyle(feature) {
    return style(feature.get('features').length);
}

function createPositionFeature(view) {
    let positionFeature = new Feature();
    positionFeature.setStyle(new Style({
        image: new CircleStyle({
            radius: 6,
            fill: new Fill({
                color: '#CC9933'
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 2
            })
        })
    }));

    let location = new Geolocation({
        // enableHighAccuracy must be set to true to have the heading value.
        trackingOptions: {
            enableHighAccuracy: true
        },
        projection: view.getProjection()
    });

    location.setTracking(true);
    location.on('change:position', function () {
        let p = location.getPosition();
        if (p) {
            positionFeature.setGeometry(new Point(p));
        }
    });

    return positionFeature;
}
