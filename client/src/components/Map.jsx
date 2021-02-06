import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Map, GoogleApiWrapper, Marker, InfoWindow, useLoadScript } from 'google-maps-react'
import { key } from '../../../config'
import axios from 'axios'
import Favorites from './Favorites'
import { FaRegHeart, FaHeart, FaRegGrinStars, FaGhost } from 'react-icons/fa'
import { RiAliensFill } from 'react-icons/ri'


class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      markers: [],
      favorites: [],
      currentLatLng: {
        lat: 0,
        lng: 0
      },
      isFavorite: false,
      drawMarker: false,
      comments: '',

    }
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
    this.onHeartClick = this.onHeartClick.bind(this);
    this.markerFetcher = this.markerFetcher.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.commentFetcher = this.commentFetcher.bind(this);
  }

  markerFetcher() {
    //make a get request
    axios.get('/markers')
    .then((marker) =>{
      console.log('THIS IS AXIOS REQUEST DATA', marker.data);

      this.setState({
        markers: marker.data,

      });

    } )
    .catch((err) => {

    });
  }
  commentFetcher() {
    //make a get request
    axios.get('/markers')
    .then((marker) =>{
     if(marker.data.name === this.state.selectedPlace.name){
       this.state.selectedPlace.comments = marker.data.comments
     }

    } )
    .catch((err) => {

    });
  }
  componentDidMount(){
    this.markerFetcher();




  }
  handleChange(event){

    const name = event.target.name;
    this.setState({
      [name]: event.target.value
    })
  }
  handleSubmit(){
    const {comments} = this.state

    console.log("LOOK HERE",
    comments
    )
    const data =
     { description: this.state.selectedPlace.name,
      comments: comments

    }
    axios.post('/comments', data)
    .then(data => console.log('User Registered'))

    .catch((err) => console.log('AXIOS POST ERROR', err))

  }



  onHeartClick() {
    console.log('click')
    console.log(this.state.selectedPlace)
    const { position, name, picture } = this.state.selectedPlace
    const { lat, lng } = position
    const data = {latitude: lat, longitude: lng, description: name, imageUrl: picture}
    axios.post('/api/favorites', data)
    .then(data =>
    console.log('favorite added--------->', data))
    .catch(err => console.log(err))
  }
  onMarkerClick (props, marker, e) {

    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

//test
  }
   onMarkerDragEnd (coord, index) {
     const { latLng } = coord;
     const lat = latLng.lat();
     const lng = latLng.lng();

     this.setState(prevState => {
       const markers = [...this.state.markers];
       markers[index] = { ...markers[index], position: { lat, lng } };
       return { markers };
     });
   };

   onInfoWindowClose() {
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    });
  }
changeView(option) {
  this.setState({
    view: option
  })
}
 onInfoWindowOpen(props, e) {
   const fav = (
     <div>
    <h5><img src={this.state.selectedPlace.picture} width={200} height={200}/></h5>
    <h6>{this.state.selectedPlace.name}</h6>
     {this.state.isFavorite ? <FaHeart
          onClick={this.onHeartClick}
    ></FaHeart> : <FaRegHeart onClick={this.onHeartClick} ></FaRegHeart>
     }
     <a href={this.state.selectedPlace.picture}>ENLARGE PHOTO</a>
      <form  action="/comments" method='POST'   >
      <input type="text" readOnly value={this.state.selectedPlace.name} onBlur={this.value=this.value=='' ? 'default'
         : this.value} name='description'/>

      <label>Comment</label>
      <input type='text'  id='comments' name='comments'   />
    <button  type="submit">Post</button>
    </form>
<div>{this.state.selectedPlace.comments}</div>

    </div>
   );
   ReactDOM.render(React.Children.only(fav), document.getElementById('iwc'))
 }

 render() {
   const style = {
    justifyContent: 'center',
    alignItems: 'center',
     width: '67vw',
     height: '55vh'
   }
   const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%'
  }
  const { view } = this.state
  //  console.log(this.state.selectedPlace)
return (

  <div>
<div className='main'>
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
 >

{this.state.markers.map((marker, index) => (

          <Marker

            key={index}
            position={{lat: marker.latitude,
                     lng: marker.longitude
            }}
            draggable={true}
            onDragend={(t, map, coord) => this.onMarkerDragEnd(coord, index)}
            name={marker.description}
            onClick={this.onMarkerClick}
            picture={marker.imageUrl}
            comments={marker.comments}
          />
        ))}
        <InfoWindow

          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onInfoWindowClose}
          onOpen={e => this.onInfoWindowOpen(this.props, e)}
        >
        <div id='iwc'>

          </div>


        </InfoWindow>
  </Map>
 </div>
 </div>
  )}
}

export default GoogleApiWrapper({
  apiKey: key
})(MapContainer);