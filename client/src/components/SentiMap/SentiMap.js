import React, { Component } from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Circle } from 'react-leaflet';
import userLocation from '../../user_location.svg';
import { getLocation } from '../../tools/API';
import './SentiMap.css';

const myIcon = L.icon({
    iconUrl: userLocation,
    iconSize: [50, 82]
});

export default class SentiMap extends Component {
    state = {
        location: {
            lat: 51.505,
            lng: -0.09
        },
        haveUsersLocation: false,
        zoom: 2,
        clicked: false,
        radius: 10
    };

    async componentDidMount() {
        getLocation().then(location => {
            this.setState({
                location,
                haveUsersLocation: true,
                zoom: 10
            });
            this.props.circleLocation(this.state.location);
        });
    }

    clickMap = e => {
        this.setState({
            location: {
                lat: e.latlng.lat,
                lng: e.latlng.lng
            },
            clicked: true
        });
        this.props.circleLocation(this.state.location);
    };

    render() {
        const position = [this.state.location.lat, this.state.location.lng];
        return (
            <Map
                className="map element"
                center={position}
                zoom={this.state.zoom}
                onClick={this.clickMap}
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors and Chat location by Iconika from the Noun Project'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {this.state.haveUsersLocation ? (
                    <div>
                        <Marker position={position} icon={myIcon} />
                        <Circle
                            center={position}
                            fillColor="blue"
                            radius={this.props.radius * 1000}
                        />
                    </div>
                ) : (
                    ''
                )}
                {this.state.clicked ? (
                    <Circle
                        center={position}
                        fillColor="blue"
                        radius={this.props.radius * 1000}
                    />
                ) : (
                    ''
                )}
            </Map>
        );
    }
}
