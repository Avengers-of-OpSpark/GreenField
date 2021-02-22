
import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow, useLoadScript } from 'google-maps-react';
import { GOOGLEMAPS_TOKEN } from '../../../../config';
import Modal from './Modal';
class CreateMarker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      marker: [
        {
          name: 'Current Position',
          position: {
            lat: 29.9533,
            lng: -90.0711
          },
        }
      ],
      isOpen: false,
      description: '',
      picture: null,
      rating: 1,
      status: 'past'
    };

    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    // this.handlePinColor = this.handlePinColor.bind(this);

  }

  handleCloseModal() {
    this.setState({ isOpen: false });
  }

  handleOpenModal() {
    this.setState({ isOpen: true });
  }

  onMarkerDragEnd (coord, index) {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    this.setState(prevState => {
      const marker = [...this.state.marker];
      marker[0] = { ...marker[0], position: { lat, lng } };
      return { marker };
    });
    this.handleOpenModal();
  }

  // handlePinColor() {
  //   const { status } = this.state;
  //   status === 'past'
  //     ? 'https://i.ibb.co/xGCc49D/map-pin-purple.png'
  //     : status === 'current'
  //       ? 'https://i.ibb.co/vZTnLrc/map-pin-green.png'
  //       : 'https://i.ibb.co/Ms8w1Hb/map-pin-red.png';

  //   // purple: <img src="https://i.ibb.co/xGCc49D/map-pin-purple.png" alt="map-pin-purple" border="0">
  //   // green: <img src="https://i.ibb.co/vZTnLrc/map-pin-green.png" alt="map-pin-green" border="0">
  //   // red: <img src="https://i.ibb.co/Ms8w1Hb/map-pin-red.png" alt="map-pin-red" border="0">
  // }

  // componentDidMount() {
  //   this.handlePinColor();
  // }

  render() {
    const { marker, status } = this.state;
    const style = {
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      width: '100%',
      height: '75vh'
    };

    const containerStyle = {
      position: 'relative',
      width: '100%',
      height: '100%'
    };

    const mapStyles = [
      {
        'featureType': 'landscape.natural',
        'elementType': 'geometry.fill',
        'stylers':
          [
            { 'visibility': 'on' },
            { 'color': '#E0EFEF' }
          ]
      },
      {
        'featureType': 'poi',
        'elementType': 'geometry.fill',
        'stylers':
          [
            { 'visibility': 'on' },
            { 'hue': '#1900FF' },
            { 'color': '#C0E8E8' }
          ]
      },
      {
        'featureType': 'road',
        'elementType': 'geometry',
        'stylers':
          [
            { 'lightness': 100 },
            { 'visibility': 'simplified' }
          ]
      },
      {
        'featureType': 'road',
        'elementType': 'labels',
        'stylers':
          [
            { 'visibility': 'off' }
          ]
      },
      {
        'featureType': 'transit.line',
        'elementType': 'geometry',
        'stylers':
          [
            { 'visibility': 'on' },
            { 'lightness': 700 }
          ]
      },
      {
        'featureType': 'water',
        'elementType': 'all',
        'stylers':
          [
            { 'color': '#7DCDCD' }
          ]
      }
    ];

    return (
      <div>
        <div className="instructions-above-map">Drag Pin to a Location</div>
        <Map
          onClick={(e) => console.log(e)}
          google={this.props.google}
          initialCenter={{
            lat: 29.9511,
            lng: -90.081807
          }}
          zoom={12}
          style={style}
          containerStyle={containerStyle}
          styles={mapStyles}
          zoomControl={true}
        ><Marker
            position={marker.position}
            name={marker.name}
            draggable={true}
            onDragend={(t, map, coord) => this.onMarkerDragEnd(coord)}
          />
          <Modal changeView={this.props.changeView} style={{position: 'auto'}} show={this.state.isOpen} handleCloseModal={this.handleCloseModal} marker={this.state.marker[0]}>
            <p>Add Pin</p>
          </Modal>
        </Map>
      </div>
    );
  }
}
const container = document.createElement('div');
document.body.appendChild(container);
export default GoogleApiWrapper({
  apiKey: GOOGLEMAPS_TOKEN
})(CreateMarker);