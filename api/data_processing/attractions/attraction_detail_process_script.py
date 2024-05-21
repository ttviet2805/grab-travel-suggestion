import json
import score_attraction

def read_json_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return [] 
    except json.JSONDecodeError:
        return []

data = read_json_file('attraction_detail.json')
# Now `data` holds the JSON data as a Python dictionary
print(len(data))
i = 0
for attraction in data:
    i += 1
    attraction['weight'] = score_attraction.get_attraction_weight(attraction)
    print(f'{i} || Weight: {attraction['weight']}')

def append_to_json_file(new_data, filename):
    data = read_json_file(filename) 
    for i in new_data:
        data.append(i)
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
append_to_json_file(data, 'final_attraction_detail.json')
print("JSON file has been created with all states of Vietnam.")