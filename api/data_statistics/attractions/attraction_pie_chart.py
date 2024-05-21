import json
from datetime import datetime
import matplotlib.pyplot as plt
import numpy as np

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

def calculate_weights_by_year(data, target_year):
    attraction_weights = {}
    for attraction in data:
        for review in attraction['review']:
            review_time = review['time'].strip()
            if review_time:
                try:
                    review_year = datetime.strptime(review_time, '%b %Y').year
                    if review_year == target_year:
                        score = review['score']
                        weight = score - 50  # Calculate weight based on the new rule
                        if attraction['name'] not in attraction_weights:
                            attraction_weights[attraction['name']] = 0
                        attraction_weights[attraction['name']] += weight
                except ValueError:
                    print(f"Error parsing date: {review_time}")
    return attraction_weights

def get_top_attractions(attraction_weights, top_n=15):
    sorted_attractions = sorted(attraction_weights.items(), key=lambda x: x[1], reverse=True)
    top_attractions = sorted_attractions[:top_n]
    return dict(top_attractions)

def plot_bar_chart(attraction_weights, title):
    names = list(attraction_weights.keys())
    weights = list(attraction_weights.values())

    fig, ax = plt.subplots(figsize=(12, 8))
    bars = ax.bar(names, weights, color=plt.cm.tab20.colors[:len(names)])

    # Create legend
    ax.legend(bars, names, title="Attractions", loc="center left", bbox_to_anchor=(1, 0.5))

    ax.set_xlabel('Attractions')
    ax.set_ylabel('Total Weight')
    ax.set_title(title)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.show()

# Main execution
data = read_json_file('score_reviews.json')

# Calculate and plot for 2023
attraction_weights_2023 = calculate_weights_by_year(data, 2023)
top_attraction_weights_2023 = get_top_attractions(attraction_weights_2023)
plot_bar_chart(top_attraction_weights_2023, 'Top Attractions by Total Weight (2023)')

# Calculate and plot for 2024
attraction_weights_2024 = calculate_weights_by_year(data, 2024)
top_attraction_weights_2024 = get_top_attractions(attraction_weights_2024)
plot_bar_chart(top_attraction_weights_2024, 'Top Attractions by Total Weight (2024)')
