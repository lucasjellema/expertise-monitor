
export function useGeoLibrary() {

    function isValidCoordinateFormat(str) {
        // Regular expression for matching coordinates with at least one decimal digit
        const regex = /^-?\d+\.\d+, -?\d+\.\d+$/;
        return regex.test(str);
      }

    const reverseGeocode = (longitude, latitude) => {

        return new Promise((resolve, reject) => {
            //, "geometry": { "coordinates": [event.gpsInfo.longitude, event.gpsInfo.latitude], "type": "Point" }
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const site = {}
                    console.log('Location details:', data);
                    // Here you can extract and use the country, state, city, etc.
                    console.log(`Country: ${data.tourism}, ${data.name} ${data.address.country}, State: ${data.address.state}, City: ${data.address.village || data.address.city || data.address.town}`);
                    site.displayLabel = data.tourism || data.name || data.address.city || data.address.town
                    site.address = data.display_name
                    site.country = data.address.country
                    site.street = data.address.street || data.address.road
                    site.postcode = data.address.postcode
                    site.class = data.class
                    site.type = data.type
                    site.quarter = data.address.quarter || data.address.neighbourhood
                    site.addresstype = data.addresstype
                    site.house_number = data.address.house_number

                    site.state = data.address.state
                    site.county = data.address.county
                    site.city = (data.address.village || data.address.city || data.address.town)
                    if (data.address.suburb) site.city = data.address.suburb + ',' + site.city
                    if (!site.label || site.label == 'To be geo-encoded') {
                        site.label = data.tourism || data.amenity || data.name || data.address.city || data.address.town || site.street

                    }
                    resolve(site)
                })
                .catch(error => { console.error('Error in reverseGeocode:', error); reject(error) });
        });
    }
    return { reverseGeocode,isValidCoordinateFormat };
}
