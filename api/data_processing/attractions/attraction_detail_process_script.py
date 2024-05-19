import json

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
# print(len(data))
for attraction in data:
    new_review_score = {}
    for key, value in attraction['review_score'].items():
        new_key = int(float(key))  # Convert string to float, then to integer
        new_review_score[str(new_key)] = value  # Store it back as string if needed
    
    # Replace the old review_score with the new dictionary
    attraction['review_score'] = new_review_score

def append_to_json_file(new_data, filename):
    data = read_json_file(filename) 
    for i in new_data:
        data.append(i)
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
append_to_json_file(data, 'final_attraction_detail.json')
print("JSON file has been created with all states of Vietnam.")