import { load, urlSettings } from 'google-maps-promise';

export class GMap {

    private map: google.maps.Map = null;

    constructor(
        private divMap: HTMLDivElement,
        private coords: { latitude: number, longitude: number}
    ) { 
        urlSettings.key = 'AIzaSyBOsD1guCZbuq-owCb6iCzjqLJSi6rLNiM';
        urlSettings.language = 'es';
        urlSettings.region = 'ES';
        urlSettings.libraries = ['geometry', 'places'];
    }

    async loadMap(): Promise<void> {
        await load();
        this.map = new google.maps.Map(this.divMap, {
            center: new google.maps.LatLng(this.coords.latitude, this.coords.longitude),
            zoom: 18,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    }

    getMap(): google.maps.Map {
        return this.map;
    }

    createMarker(coords: { latitude: number, longitude: number}, color = 'red'): google.maps.Marker {
        var opts: google.maps.MarkerOptions = {
            position: new google.maps.LatLng(coords.latitude, coords.longitude),
            map: this.map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png'
        };
        return new google.maps.Marker(opts);
    }

    createAutocomplete(input: HTMLInputElement) {
        const autocomplete = new google.maps.places.Autocomplete(input);
        const infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(autocomplete, 'place_changed', e => {
            infowindow.close();
            let place = autocomplete.getPlace();
            if (!place.geometry) return;

            this.map.panTo(place.geometry.location);
            let coords = <Coordinates>{
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng()
            };
            const marker = this.createMarker(coords, 'red');

            infowindow.setContent('<div><strong>'
                + place.name 
                + '</strong><br>'
                + 'Latlng: ' 
                + place.geometry.location.lat()
                + ", " + place.geometry.location.lng()
                + '<br>'
                + place.formatted_address + '</div>');
            infowindow.open(this.map, marker);
        });
    }
}
