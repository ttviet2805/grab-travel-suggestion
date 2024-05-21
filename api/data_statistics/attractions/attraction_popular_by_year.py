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

def calculate_yearly_weights(data, start_year=2010, end_year=2023):
    attraction_weights = {}
    for attraction in data:
        yearly_weights = {year: 0 for year in range(start_year, end_year + 1)}
        for review in attraction['review']:
            review_time = review['time'].strip()
            if review_time:
                try:
                    review_year = datetime.strptime(review_time, '%b %Y').year
                    if start_year <= review_year <= end_year:
                        score = review['score']
                        weight = score - 50  # Calculate weight based on the new rule
                        yearly_weights[review_year] += weight
                except ValueError:
                    print(f"Error parsing date: {review_time}")
        
        attraction_weights[attraction['name']] = yearly_weights
    return attraction_weights

def plot_highest_weights_each_year(attraction_weights, start_year=2010, end_year=2023):
    yearly_highest_weights = {}
    for year in range(start_year, end_year + 1):
        highest_weight = float('-inf')
        best_attraction = None
        for attraction, weights in attraction_weights.items():
            if year in weights and weights[year] > highest_weight:
                highest_weight = weights[year]
                best_attraction = attraction
        yearly_highest_weights[year] = (best_attraction, highest_weight)
    
    # Plotting
    years = list(yearly_highest_weights.keys())
    weights = [yearly_highest_weights[year][1] for year in years]
    attractions = [yearly_highest_weights[year][0] for year in years]

    colors = plt.cm.tab20(np.linspace(0, 1, len(set(attractions))))
    attraction_to_color = {attr: colors[i] for i, attr in enumerate(set(attractions))}

    plt.figure(figsize=(12, 8))
    for i, year in enumerate(years):
        plt.bar(year, weights[i], color=attraction_to_color[attractions[i]], label=attractions[i])

    # Create legend
    handles, labels = plt.gca().get_legend_handles_labels()
    by_label = dict(zip(labels, handles))
    plt.legend(by_label.values(), by_label.keys(), bbox_to_anchor=(1, 1), loc='upper left')

    plt.xlabel('Year')
    plt.ylabel('Total Weight')
    plt.title('Highest Total Weights per Year for Attractions')
    plt.xticks(years)
    plt.grid(True, axis='y')
    plt.tight_layout()
    plt.show()

# Main execution
data = read_json_file('score_reviews.json')
attraction_weights = calculate_yearly_weights(data)
plot_highest_weights_each_year(attraction_weights)
