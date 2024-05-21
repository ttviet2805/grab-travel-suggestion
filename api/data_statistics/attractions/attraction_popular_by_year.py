import json
import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime

def read_json_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return [] 
    except json.JSONDecodeError:
        return []

def filter_reviews_by_year(data, start_year, end_year):
    # Lọc các reviews trong khoảng thời gian cho trước
    filtered_data = []
    for item in data:
        filtered_reviews = []
        for review in item['review']:
            year = datetime.strptime(review['time'], '%b %Y').year
            if start_year <= year <= end_year:
                filtered_reviews.append(review)
        if filtered_reviews:
            new_item = item.copy()
            new_item['review'] = filtered_reviews
            filtered_data.append(new_item)
    return filtered_data

def plot_top_weights(data, top_n=10):
    # Trích xuất trọng số và tên, sau đó vẽ biểu đồ
    weights = [(item['name'], item['weight']) for item in data]
    weights.sort(key=lambda x: x[1], reverse=True)
    top_weights = weights[:top_n]
    
    names = [item[0] for item in top_weights]
    weights = [item[1] for item in top_weights]
    
    plt.figure(figsize=(10, 8))
    plt.barh(names, weights, color='skyblue')
    plt.xlabel('Weight')
    plt.ylabel('Attraction Name')
    plt.title(f'Top {top_n} Attractions by Weight')
    plt.gca().invert_yaxis()
    plt.show()

# Đọc dữ liệu
data = read_json_file('final_attraction_detail.json')
print(len(data))

# Lọc và thống kê
filtered_data = filter_reviews_by_year(data, 2003, 2023)
plot_top_weights(filtered_data, top_n=10)