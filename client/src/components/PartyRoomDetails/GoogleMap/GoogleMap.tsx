import React from 'react'
import styles from './GoogleMap.module.css'
import GoogleMapReact, { Maps } from 'google-map-react'

export default function GoogleMap(props: { address: string }) {
  const handleApiLoaded = (map: google.maps.Map, maps: Maps) => {
    const infowindow = new google.maps.InfoWindow()
    const service = new google.maps.places.PlacesService(map)

    const request = {
      query: props.address,
      fields: ['name', 'geometry']
    }
    function createMarker(place: google.maps.places.PlaceResult) {
      if (!place.geometry || !place.geometry.location) return
      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location
      })
      google.maps.event.addListener(marker, 'click', () => {
        infowindow.setContent(place.name || '')
        infowindow.open(map)
      })
    }
    service.findPlaceFromQuery(
      request,
      (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          for (let i = 0; i < results.length; i++) {
            createMarker(results[i])
          }
          map.setCenter(results[0].geometry!.location!)
          map.setZoom(16)
        }
      }
    )
  }

  return (
    <div className={styles.container}>
      <div style={{ height: '100%', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: 'AIzaSyD61MBVKQ4lUvqHyFtm1GDQiAL2X6hTKyE',
            libraries: 'places'
          }}
          defaultCenter={{
            lat: 22.3588678,
            lng: 114.1244435
          }}
          defaultZoom={11}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        />
      </div>
    </div>
  )
}
