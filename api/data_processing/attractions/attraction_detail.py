from bs4 import BeautifulSoup
import json
import requests
import pandas as pd

def read_json_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return [] 
    except json.JSONDecodeError:
        return []

data = read_json_file('attractions.json')

credentials = ('minhminh', 'Gogogogo1234')
url = "https://www.tripadvisor.com"
payload = {
    'source': 'universal',
    'render': 'html',
    'url': url,
}
response = requests.post(
    'https://realtime.oxylabs.io/v1/queries',
    auth=credentials,
    json=payload,
)
print(response.status_code)

# content = response.json()["results"][0]["content"]
# soup = BeautifulSoup(content, "html.parser")

# data = []
# for div in soup.find_all("div", {"class": "result"}):
#     name = div.find('div', {"class": "result-title"}).find('span').get_text(strip=True)
#     rating = div.find('span', {"class": "ui_bubble_rating"})['alt']

#     review = div.find('a', {"class": "review_count"}).get_text(strip=True)
#     data.append({
#         "name": name,
#         "rating": rating,
#         "review": review,
#     })
