import React, {Component} from "react";
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from "ol/style";
import {Cluster, OSM, Vector as VectorSource} from "ol/source";
import {Tile, Vector} from "ol/layer";
import View from "ol/View";
import {fromLonLat} from "ol/proj";
import Map from "ol/Map"
import Geolocation from "ol/Geolocation";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";

export default class OsmMap extends Component {
    static ref = React.createRef();

    constructor(props) {
        super(props);
        this.source = new VectorSource({
            features: []
        });
        this.mounted = false;
    }

    componentDidMount() {
        let map = renderMap(this.source);
        map.on('click', e => {
            map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
                map.getView().setCenter(feature.get("geometry").flatCoordinates);
                this.props.onLocationsSelect(feature.get('features').map(feature => feature.getId()))
            });
            map.getView().setZoom(map.getView().getZoom() + 2)
        });
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (<div id="map" className="map"/>)
    }

    static setupClusters(locations) {
        let map = this.ref.current;
        if(map.mounted) {
            map.source.clear();
            map.source.addFeatures(locations.map(l => toFeature(l)));
        }
    }
}

function renderMap(clustersSource) {

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

    let geolocation = new Geolocation({
        // enableHighAccuracy must be set to true to have the heading value.
        trackingOptions: {
            enableHighAccuracy: true
        },
        projection: view.getProjection()
    });
    let position = new Vector({
        source: new VectorSource({
            features: [(createPositionFeature(view, geolocation))]
        })
    });

    return new Map({
        layers: [tiles, clusters, position],
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

function createPositionFeature(view, location) {
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

    location.setTracking(true);
    location.on('change:position', function () {
        let p = location.getPosition();
        if (p) {
            positionFeature.setGeometry(new Point(p));
        }
    });

    return positionFeature;
}
