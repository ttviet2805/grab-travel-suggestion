import json
import score_attraction
import numpy as np

def read_json_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return [] 
    except json.JSONDecodeError:
        return []

data = read_json_file('final_attraction_detail.json')
# Now `data` holds the JSON data as a Python dictionary
print(len(data))
i = 0
for attraction in data:
    i += 1
    comments = attraction['review']
    weights = []
    for comment in comments:
        weight = score_attraction.get_comment_weight(comment['rating'], comment['title'], comment['content'])
        comment['score'] = weight
        weights.append(weight)
    
    if weights:
        average_weight = np.mean(weights)
    else:
        average_weight = 0
    
    attraction['weight'] = average_weight
    print(f'{i} || {attraction['name']} || Weight: {attraction['weight']}')

def append_to_json_file(new_data, filename):
    data = read_json_file(filename) 
    for i in new_data:
        data.append(i)
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
append_to_json_file(data, 'score_reviews.json')
print("JSON file has been created with all states of Vietnam.")