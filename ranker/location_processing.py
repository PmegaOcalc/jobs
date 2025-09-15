from geotext import GeoText

# Define the array of strings
places = ['city', 'us', 'california', 'new york',
          'british columbia', 'poland', 'random string']

# Initialize an empty list to store the locations
locations = []

# Iterate over the array
for place in places:
    # Use GeoText to find geographical locations in the string
    geo = GeoText(place)
    if geo.cities:
        locations.extend(geo.cities)
    elif geo.countries:
        locations.extend(geo.countries)
    else:
        print(geo.index)

# Print the list of locations
print(locations)
