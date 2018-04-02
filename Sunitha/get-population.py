import urllib.request
import ast
key = "6756f7325cf88843d478018eb4f3e62e87d767c4"
mykey = "6756f7325cf88843d478018eb4f3e62e87d767c4"
#https://api.census.gov/data/2010/sf1?key=6756f7325cf88843d478018eb4f3e62e87d767c4&get=P0010001&in=state:006&for=county:001
# County FIPS code, state code https://www.weather.gov/hnx/cafips
# https://stackoverflow.com/questions/28933220/us-census-api-get-the-population-of-every-city-in-a-state-using-python

class Census:
    def __init__(self, key):
        self.key = key

    def get(self, fields, geo, year=2010, dataset='sf1'):
        fields = [','.join(fields)]
        base_url = 'http://api.census.gov/data/%s/%s?key=%s&get=' % (str(year), dataset, self.key)
        query = fields
        for item in geo:
            query.append(item)
        add_url = '&'.join(query)
        url = base_url + add_url
        print(url)
        req = urllib.request.Request(url)
        response = urllib.request.urlopen(req)
        return response.read()

c = Census('<mykey>')
state = c.get(['P0010001'], ['for=state:25'])
# url: http://api.census.gov/data/2010/sf1?key=<mykey>&get=P0010001&for=state:25
county = c.get(['P0010001'], ['in=state:25', 'for=county:*'])
# url: http://api.census.gov/data/2010/sf1?key=<mykey>&get=P0010001&in=state:25&for=county:*
city = c.get(['P0010001'], ['in=state:25', 'for=place:*'])
# url: http://api.census.gov/data/2010/sf1?key=<mykey>&get=P0010001&in=state:25&for=place:*

# Cast result to list type
state_result = ast.literal_eval(state.decode('utf8'))
county_result = ast.literal_eval(county.decode('utf8'))
city_result = ast.literal_eval(city.decode('utf8'))

def count_pop_county():
    count = 0
    for item in county_result[1:]:
        count += int(item[0])
    return count

def count_pop_city():
    count = 0
    for item in city_result[1:]:
        count += int(item[0])
    return count
