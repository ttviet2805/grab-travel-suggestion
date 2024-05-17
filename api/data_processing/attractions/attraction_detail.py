from bs4 import BeautifulSoup
import json
import requests

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

attraction_details = []

for i in range(1200, min(1400, len(data))):
    print("Attraction ", i + 1)
    attraction_detail = {}
    attraction_detail['name'] = data[i]['name']
    attraction_detail['image'] = data[i]['image']
    attraction_detail['state'] = data[i]['state']
    attraction_detail['rating'] = data[i]['rating']
    attraction_detail['tag'] = data[i]['tag']

    attraction_link = data[i]['url']
    url = "https://www.tripadvisor.com" + attraction_link
    print(url)
    payload = {
        'source': 'universal',
        "geo_location": "United States",
        'url': url
    }
    response = requests.post(
        'https://realtime.oxylabs.io/v1/queries',
        auth=credentials,
        json=payload,
    )
    print("Status code: ", response.status_code)
    content = response.json()["results"][0]["content"]
    soup = BeautifulSoup(content, "html.parser")

    reviews = []
    review_score = {'0': 0, '1.0': 0, '2.0': 0, '3.0': 0, '4.0': 0, '5.0': 0}

    for index, div in enumerate(soup.find_all("div", {"class": "_c", "data-automation": "reviewCard"})):
        cur_review = {}

        username_anchor = div.find("a", {"class": "BMQDV _F Gv wSSLS SwZTJ FGwzt ukgoS"})
        username = ""
        if username_anchor:
            username = username_anchor.get_text(strip=True)
        cur_review['username'] = username

        rating_title = div.find("title")
        rating = 0
        if rating_title:
            tmp_rating = rating_title.get_text(strip=True)
            import re
            match = re.search(r'\d+(\.\d+)?', tmp_rating)
            rating = match.group()
        cur_review['rating'] = rating
        review_score[f'{rating}'] += 1

        title_span = div.find("span", {"class": "yCeTE"})
        title = ""
        if title_span:
            title = title_span.get_text(strip=True)
        cur_review['title'] = title

        content_div = div.find("div", {"class": "biGQs _P pZUbB KxBGd"})
        content_span = content_div.find("span", {"class": "yCeTE"})
        content = ""
        if content_span:
            content = content_span.get_text(strip=True)
        cur_review['content'] = content
        reviews.append(cur_review)
        
    attraction_detail['num_review'] = len(reviews)
    attraction_detail['review_score'] = review_score
    attraction_detail['review'] = reviews
    attraction_details.append(attraction_detail)

def read_json_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return [] 
    except json.JSONDecodeError:
        return []
def append_to_json_file(new_data, filename):
    data = read_json_file(filename) 
    for i in new_data:
        data.append(i)
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
append_to_json_file(attraction_details, 'attraction_detail.json')
print("JSON file has been created with all states of Vietnam.")