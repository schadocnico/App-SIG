import React from "react";
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
class OLMapFragment extends React.Component {
 
    constructor(props) {
        super(props)
        this.updateDimensions = this.updateDimensions.bind(this)
    }
    updateDimensions(){
        const h = window.innerWidth >= 992 ? window.innerHeight : 400
        this.setState({height: h})
    }
    componentWillMount(){
        window.addEventListener('resize', this.updateDimensions)
        this.updateDimensions()
    }
    componentDidMount(){
        let format = 'image/png';
        let bounds = [1.93954952537819, 47.8448985682432,
            1.94007434047805, 47.8455632040748];
        // Create an Openlayer Map instance with two tile layers
        const map = new Map({
            //  Display the map in the div with the id of map
            target: 'map',
            layers: [
                new TileLayer({
                    source: new TileWMSSource({
                      ratio: 1,
                      url: 'http://176.169.46.223:8080/geoserver/espace/wms',
                      params: {'FORMAT': format,
                               'VERSION': '1.1.1',  
                            "STYLES": '',
                            "LAYERS": 'espace:rdc',
                            "exceptions": 'application/vnd.ogc.se_inimage',
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
                            "LAYERS": 'espace:rdc',
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
                center: [0, 0],
                zoom: 2
            })
        })
        map.getView().fit(bounds, map.getSize());
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