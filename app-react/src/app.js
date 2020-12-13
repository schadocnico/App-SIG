import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import Bdd from "./bdd.js";
// Start Openlayers imports
import { 
    Map,
    View
 } from 'ol'
import {
    GeoJSON,
    XYZ
} from 'ol/format'
import {
    Tile as TileLayer,
    Vector as VectorLayer
} from 'ol/layer'
import {
    Vector as VectorSource,
    OSM as OSMSource,
    XYZ as XYZSource,
    TileWMS as TileWMSSource
} from 'ol/source'
import {
    Select as SelectInteraction,
    defaults as DefaultInteractions
} from 'ol/interaction'
import { 
    Attribution,
    ScaleLine,
    ZoomSlider,
    Zoom,
    Rotate,
    MousePosition,
    OverviewMap,
    defaults as DefaultControls
} from 'ol/control'
import {
    Style,
    Fill as FillStyle,
    RegularShape as RegularShapeStyle,
    Stroke as StrokeStyle
} from 'ol/style'
import { 
    Projection,
    get as getProjection
} from 'ol/proj'
import Point from 'ol/geom/Point';


class OLMapFragment extends React.Component {
 
    constructor(props) {
        super(props)
        this.localisation();
        this.updateDimensions = this.updateDimensions.bind(this)
    }
    localisation(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let numSalle = 1;
        if(urlParams.has('salle')){
            numSalle = urlParams.get('salle')
        }
        //Demande a l'api la localisation
        const API = 'http://176.169.46.223:5000/qr/' + numSalle;

        fetch(API)
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.setState({center_x: data.st_x, center_y: data.st_y}, () => this.test());
                //map.getView().setCenter(ol.proj.fromLonLat([lon, lat]))
            });
        
    }
    updateDimensions(){
        const h = window.innerHeight*0.45
        this.setState({height: h})
    }
    componentWillMount(){
        window.addEventListener('resize', this.updateDimensions)
        this.updateDimensions()
    }
    test(){
        let format = 'image/png';
        // Create an Openlayer Map instance with two tile layers
        let map = new Map({
            //  Display the map in the div with the id of map
            target: 'map',
            layers: [
                new TileLayer({
                    source: new TileWMSSource({
                      ratio: 1,
                      url: 'http://176.169.46.223:8080/geoserver/espace/wms',
                      params: {'FORMAT': format,
                               'VERSION': '1.1.1',
                               tiled: true,
                            "STYLES": '',
                            "LAYERS": 'espace:rdc',
                            "exceptions": 'application/vnd.ogc.se_inimage',
                            tilesOrigin: 1.93954952537819 + "," + 47.8448985682432
                      }
                    })
                }),
                new TileLayer({
                    source: new TileWMSSource({
                      ratio: 1,
                      url: 'http://176.169.46.223:8080/geoserver/espace/wms',
                      params: {'FORMAT': format,
                               'VERSION': '1.1.1',
                               tiled: true,
                            "STYLES": '',
                            "LAYERS": 'espace:qrc_rdc',
                            "exceptions": 'application/vnd.ogc.se_inimage',
                            tilesOrigin: 1.93954952537819 + "," + 47.8448985682432
                      }
                    })
                })
            ],
            // Add in the following map controls
            controls: DefaultControls().extend([
                new ZoomSlider(),
                new MousePosition(),
                new ScaleLine(),
                new OverviewMap()
            ]),
            // Render the tile layers in a map view with a Mercator projection
            view: new View({
                projection: 'EPSG:4326',
                center: [this.state.center_x, this.state.center_y],
                zoom: 21
            })
        })
        console.log(this.state.center_x);
        map.getView().setCenter([this.state.center_x, this.state.center_y]);
        
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.updateDimensions)
    }

    
    render(){
        const style = {
            width: '100%',
            height:this.state.height,
            backgroundColor: '#cccccc',
        }
        return ( 

            <div id='map' style={style} >
            </div>

        )
    }
}

function App(props){
        
        return (
            <div>
               <OLMapFragment />
               <Bdd />
               
            </div>
        );
}

export default App;