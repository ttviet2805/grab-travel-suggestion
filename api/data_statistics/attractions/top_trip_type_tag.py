import json
from datetime import datetime
import matplotlib.pyplot as plt
import numpy as np

# Hàm để đọc tệp JSON
def read_json_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print("File not found.")
        return []
    except json.JSONDecodeError:
        print("Error decoding JSON.")
        return []

# Hàm để tính toán tổng weight cho mỗi tag dựa trên trip_type trong một năm mục tiêu
def calculate_weights_by_trip_type(data, target_year):
    trip_type_weights = {}
    
    for attraction in data:
        for tag in attraction['tag_split']:
            for review in attraction['review']:
                review_time = review['time'].strip()
                if review_time:
                    try:
                        review_date = datetime.strptime(review_time, '%b %Y')
                        if review_date.year == target_year:
                            trip_type = review['type_trip']
                            if trip_type not in trip_type_weights:
                                trip_type_weights[trip_type] = {}
                            if tag not in trip_type_weights[trip_type]:
                                trip_type_weights[trip_type][tag] = 0
                            score = review['score']
                            weight = score - 50  # Calculate weight based on the new rule
                            trip_type_weights[trip_type][tag] += weight
                    except ValueError:
                        print(f"Error parsing date: {review_time}")
    return trip_type_weights

# Hàm để lấy top tag có weight cao nhất cho mỗi loại trip_type
def get_top_tags_by_trip_type(trip_type_weights, top_n=1):
    top_tags_by_trip_type = {}
    for trip_type, tag_weights in trip_type_weights.items():
        sorted_tags = sorted(tag_weights.items(), key=lambda x: x[1], reverse=True)
        top_tags_by_trip_type[trip_type] = sorted_tags[:top_n]
    return top_tags_by_trip_type

# Hàm để vẽ biểu đồ tròn
def plot_pie_chart(top_tags_by_trip_type, title):
    trip_types = list(top_tags_by_trip_type.keys())
    tags = [tag for trip_type in trip_types for tag, _ in top_tags_by_trip_type[trip_type]]
    weights = [weight for trip_type in trip_types for _, weight in top_tags_by_trip_type[trip_type]]
    colors = plt.cm.tab20(np.linspace(0, 1, len(trip_types)))

    fig, ax = plt.subplots(figsize=(12, 8))
    wedges, texts, autotexts = ax.pie(weights, labels=trip_types, autopct='%1.1f%%', startangle=140, colors=colors)

    # Create legend
    ax.legend(wedges, tags, title="Tags", loc="center left", bbox_to_anchor=(1, 0.5))

    plt.setp(autotexts, size=10, weight="bold")
    ax.set_title(title)

    plt.show()

# Main execution
data = read_json_file('score_reviews.json')

# Calculate weights by trip type for the year 2022
trip_type_weights_2022 = calculate_weights_by_trip_type(data, 2022)
top_tags_by_trip_type_2022 = get_top_tags_by_trip_type(trip_type_weights_2022)

# Plot pie chart for trip types for 2022
plot_pie_chart(top_tags_by_trip_type_2022, 'Top Tags by Total Weight for Each Trip Type (2022)')

# Calculate weights by trip type for the year 2023
trip_type_weights_2023 = calculate_weights_by_trip_type(data, 2023)
top_tags_by_trip_type_2023 = get_top_tags_by_trip_type(trip_type_weights_2023)

# Plot pie chart for trip types for 2023
plot_pie_chart(top_tags_by_trip_type_2023, 'Top Tags by Total Weight for Each Trip Type (2023)')