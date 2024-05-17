import asyncio
import json
import random
import string
from typing import List, TypedDict

import httpx
from loguru import logger as log
from bs4 import BeautifulSoup
import pandas as pd
import requests


class LocationData(TypedDict):
    """result dataclass for tripadvisor location data"""

    localizedName: str
    url: str
    HOTELS_URL: str
    ATTRACTIONS_URL: str
    RESTAURANTS_URL: str
    placeType: str
    latitude: float
    longitude: float


async def scrape_location_data(query: str, client: httpx.AsyncClient) -> List[LocationData]:
    """
    scrape search location data from a given query.
    e.g. "New York" will return us TripAdvisor's location details for this query
    """
    # log.info(f"scraping location data: {query}")
    # the graphql payload that defines our search
    # note: that changing values outside of expected ranges can block the web scraper
    payload = [
            {
                "variables": {
                    "request": {
                        "query": query,
                        "limit": 10,
                        "scope": "WORLDWIDE",
                        "locale": "en-US",
                        "scopeGeoId": 1,
                        "searchCenter": None,
                        # note: here you can expand to search for differents.
                        "types": [
                            "LOCATION",
                            # "QUERY_SUGGESTION",
                            # "RESCUE_RESULT"
                        ],
                        "locationTypes": [
                            "GEO",
                            "AIRPORT",
                            "ACCOMMODATION",
                            "ATTRACTION",
                            "ATTRACTION_PRODUCT",
                            "EATERY",
                            "NEIGHBORHOOD",
                            "AIRLINE",
                            "SHOPPING",
                            "UNIVERSITY",
                            "GENERAL_HOSPITAL",
                            "PORT",
                            "FERRY",
                            "CORPORATION",
                            "VACATION_RENTAL",
                            "SHIP",
                            "CRUISE_LINE",
                            "CAR_RENTAL_OFFICE",
                        ],
                        "userId": None,
                        "context": {},
                        "enabledFeatures": ["articles"],
                        "includeRecent": True,
                    }
                },
                # Every graphql query has a query ID that doesn't change often:
                "query": "84b17ed122fbdbd4",
                "extensions": {"preRegisteredQueryId": "84b17ed122fbdbd4"},
            }
        ]

    # we need to generate a random request ID for this request to succeed
    random_request_id = "".join(
        random.choice(string.ascii_lowercase + string.digits) for i in range(180)
    )
    headers = {
        "X-Requested-By": random_request_id,
        "Referer": "https://www.tripadvisor.com/Hotels",
        "Origin": "https://www.tripadvisor.com",
    }
    result = await client.post(
        url="https://www.tripadvisor.com/data/graphql/ids",
        json=payload,
        headers=headers,
    )
    data = json.loads(result.content)
    results = data[0]["data"]["Typeahead_autocomplete"]["results"]
    results = [r['details'] for r in results if 'details' in r] # strip metadata
    # log.info(f"found {len(results)} results")
    return results

# To avoid being instantly blocked we'll be using request headers that
# mimic Chrome browser on Windows
BASE_HEADERS = {
    "authority": "www.tripadvisor.com",
    "accept-language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "accept-language": "en-US;en;q=0.9",
    "accept-encoding": "gzip, deflate, br",
}
# start HTTP session client with our headers and HTTP2
client = httpx.AsyncClient(
    http2=True,  # http2 connections are significantly less likely to get blocked
    headers=BASE_HEADERS,
    timeout=httpx.Timeout(150.0),
    limits=httpx.Limits(max_connections=5),
)

hotels = []
listError = []

async def run(query: str):
    result = await scrape_location_data(query, client)
    # print(json.dumps(result, indent=2))
    url = result[0]["HOTELS_URL"]
    # print("url before: ", url)
    # index = url.find('Activities-')
    # url = url[:index + len('Activities-')] + 'oa0-' + url[index + len('Activities-'):]
    url = 'https://www.tripadvisor.com' + url
    print("URL: " + url)
    # Định nghĩa các thông tin cần gửi trong body của POST request
    payload = {
        "source": "universal",
        "url": url,
        "geo_location": "United States"
    }

    # Đường link gửi request
    url = "https://realtime.oxylabs.io/v1/queries"

    # Định nghĩa thông tin xác thực (Basic Auth)
    credentials = ('minhminh', 'Gogogogo1234')

    response = requests.post(url, json=payload, auth=credentials)

    content = response.json()["results"][0]["content"]
    # print("content:", content)
    soup = BeautifulSoup(content, "html.parser")
    # print("soup:", soup)

    MAX_HOTELS = 5
    cnt_image = 0
    cnt = 0
    data = []
    for div in soup.find_all("div", {"class": "qeraN _T qMONr iOIte iJfMg ndRxi rcibp FKwyn"}):
        cnt += 1
        if cnt >= MAX_HOTELS:
            break
        name_div = div.find("div", {"class": "nBrpc o W"})
        name = ""
        if name_div:
            name = name_div.get_text(strip=True)
            import re
            def remove_leading_number_dot(s):
                return re.sub(r'^\d+\.', '', s)
            name = remove_leading_number_dot(name)
            
        rating_tag = div.find("div", {"class": "luFhX o W f u w JSdbl" })
        rating = 0
        if rating_tag:
            tmp_rating = rating_tag.get('aria-label')
            import re
            match = re.search(r'\d+(\.\d+)?', tmp_rating)
            rating = match.group()

        hotel_anchor = div.find("a")
        hotel_link = ""
        if hotel_anchor:
            hotel_link = hotel_anchor.get('href')

        img_tag = div.find('img')
        img_src = ""
        if img_tag:
            img_src = img_tag.get('src')
            cnt_image += 1

        data.append({
            "name": name,
            "rating": rating,
            "url": 'tripadvisor.com' + hotel_link,
            'image': img_src,
            'state': query
        })
    
    print(data)

    if len(data) == 0:
        print(query + ' -----------------------------------------------------------------------')
        listError.append(query)
        return
    if cnt_image == 0:
        for i in data:
            if i['name'] == "" or i['image'] == "":
                print(query + ' -----------------------------------------------------------------------')
                listError.append(query)
                return
    for hotel in data:
        hotels.append(hotel)

if __name__ == "__main__":
    states = [
        "An Giang Province", "Ba Ria–Vung Tau Province", "Bac Giang Province", 
        "Bac Kan Province", "Bac Lieu Province", "Bac Ninh Province", "Ben Tre Province", 
        "Binh Dinh Province", "Binh Duong Province", "Binh Phuoc Province", 
        "Binh Thuan Province", "Ca Mau Province", "Can Tho", "Cao Bang Province", 
        "Da Nang", "Dak Lak Province", "Dak Nong Province", "Dien Bien Province", 
        "Dong Nai Province", "Dong Thap Province", "Gia Lai Province", "Ha Giang Province", 
        "Ha Nam Province", "Ha Noi", "Ha Tinh Province", "Hai Duong Province", 
        "Hai Phong", "Hau Giang Province", "Ho Chi Minh City", "Hoa Binh Province", 
        "Hung Yen Province", "Khanh Hoa Province", "Kien Giang Province", 
        "Kon Tum Province", "Lai Chau Province", "Lam Dong Province", "Lang Son Province", 
        "Lao Cai Province", "Long An Province", "Nam Dinh Province", "Nghe An Province", 
        "Ninh Binh Province", "Ninh Thuan Province", "Phu Tho Province", "Phu Yen Province", 
        "Quang Binh Province", "Quang Nam Province", "Quang Ngai Province", 
        "Quang Ninh Province", "Quang Tri Province", "Soc Trang Province", "Son La Province", 
        "Tay Ninh Province", "Thai Binh Province", "Thai Nguyen Province", 
        "Thanh Hoa Province", "Thua Thien Hue Province", "Tien Giang Province", 
        "Tra Vinh Province", "Tuyen Quang Province", "Vinh Long Province", 
        "Vinh Phuc Province", "Yen Bai Province"
    ]

    # Prepare to gather all tasks and run them concurrently
    async def main():

        # tasks = [run(states[i]) for i in range(30, min(70, len(states)))]
        # await asyncio.gather(*tasks)
        # def read_list_from_txt_file(filename):
        #     with open(filename, 'r', encoding='utf-8') as file:
        #         lines = file.readlines()
        #         lines = [line.strip() for line in lines]
        #     return lines
        # # error_states = read_list_from_txt_file('error_states.txt')
        list_errors = ['Binh Duong Province', 'Ha Giang Province']
        tasks = [run(list_errors[i]) for i in range(0, len(list_errors))]
        await asyncio.gather(*tasks)
    
    asyncio.run(main())

    # Be sure to close the client
    # asyncio.run(client.aclose())

    def append_to_txt_file(string_list, filename):
        with open(filename, 'a', encoding='utf-8') as file:
            for item in string_list:
                file.write(f"{item}\n")
    append_to_txt_file(listError, 'error_states.txt')

    # JSON
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
    append_to_json_file(hotels, 'hotels.json')
    print("JSON file has been created with all states of Vietnam.")