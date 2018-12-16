import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export class Gmap {
    private map: mapboxgl.Map = null;
    private autocomplete: MapboxGeocoder = null;
    readonly accessToken = 'pk.eyJ1IjoiZnJhbmNlc2MyNTA5IiwiYSI6ImNqcHFwOHcwNDAweTk0MnM5OTVrMmRlOTEifQ.9VBKEICMr7O1KTBOcPlbng';

    constructor(private coords: {latitude: number, longitude: number}, private divMap: HTMLDivElement) {
        console.log(coords);
    }

    async loadMap(): Promise<mapboxgl.Map> {
        if (this.map !== null) return this.map;

        (<any>mapboxgl).accessToken = this.accessToken;

        this.map = new mapboxgl.Map({
            container: this.divMap,
            style: 'mapbox://styles/mapbox/streets-v10',
            center: [this.coords.longitude, this.coords.latitude],
            zoom: 14
        });
        return this.map;
    } 

    createMarker(lat: number, lng: number, color: string): mapboxgl.Marker {
        if(this.map === null) return null;
        return new mapboxgl.Marker().setLngLat([this.coords.longitude, this.coords.latitude]).addTo(this.map);
    }

    getAutocomplete(): MapboxGeocoder {
        if(this.map === null) return null;
        if(this.autocomplete !== null) return this.autocomplete;

        const autocomplete = new MapboxGeocoder({accessToken: this.accessToken});
        this.map.addControl(autocomplete);

        return autocomplete;
    }
}
