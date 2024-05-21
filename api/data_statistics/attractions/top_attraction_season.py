import json
from datetime import datetime
import numpy as np
import matplotlib.pyplot as plt

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

# Hàm để tính toán tổng weight cho mỗi địa điểm trong mỗi mùa của năm target_year
def calculate_weights_by_season(data, target_year):
    season_mapping = {
        'Spring': ['Mar', 'Apr', 'May'],
        'Summer': ['Jun', 'Jul', 'Aug'],
        'Fall': ['Sep', 'Oct', 'Nov'],
        'Winter': ['Dec', 'Jan', 'Feb']
    }
    season_weights = {season: {} for season in season_mapping.keys()}
    
    for attraction in data:
        for review in attraction['review']:
            review_time = review['time'].strip()
            if review_time:
                try:
                    review_date = datetime.strptime(review_time, '%b %Y')
                    if review_date.year == target_year:
                        for season, months in season_mapping.items():
                            if review_date.strftime('%b') in months:
                                if attraction['name'] not in season_weights[season]:
                                    season_weights[season][attraction['name']] = 0
                                score = review['score']
                                weight = score - 50  # Calculate weight based on the new rule
                                season_weights[season][attraction['name']] += weight
                except ValueError:
                    print(f"Error parsing date: {review_time}")
    return season_weights

# Hàm để lấy top attraction có weight cao nhất cho mỗi mùa
def get_top_attractions_by_season(season_weights, top_n=1):
    top_attractions_by_season = {}
    for season, attraction_weights in season_weights.items():
        sorted_attractions = sorted(attraction_weights.items(), key=lambda x: x[1], reverse=True)
        top_attractions_by_season[season] = sorted_attractions[:top_n]
    return top_attractions_by_season

# Hàm để vẽ biểu đồ cột
def plot_bar_chart(top_attractions_by_season, title):
    seasons = list(top_attractions_by_season.keys())
    attractions = [attraction for season in seasons for attraction, _ in top_attractions_by_season[season]]
    weights = [weight for season in seasons for _, weight in top_attractions_by_season[season]]
    colors = plt.cm.tab20(np.linspace(0, 1, len(attractions)))

    fig, ax = plt.subplots(figsize=(12, 8))
    bars = ax.bar(seasons, weights, color=colors[:len(seasons)])

    # Create legend
    ax.legend(bars, attractions, title="Attractions", loc="center left", bbox_to_anchor=(1, 0.5))

    ax.set_xlabel('Season')
    ax.set_ylabel('Total Weight')
    ax.set_title(title)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.show()

# Main execution
data = read_json_file('score_reviews.json')

# Calculate weights by season for the year 2023
season_weights_2023 = calculate_weights_by_season(data, 2023)
top_attractions_by_season_2023 = get_top_attractions_by_season(season_weights_2023)

# Plot bar chart for seasons for 2023
plot_bar_chart(top_attractions_by_season_2023, 'Top Attractions by Total Weight for Each Season (2023)')

# Calculate weights by season for the year 2024
season_weights_2024 = calculate_weights_by_season(data, 2022)
top_attractions_by_season_2024 = get_top_attractions_by_season(season_weights_2024)

# Plot bar chart for seasons for 2024
plot_bar_chart(top_attractions_by_season_2024, 'Top Attractions by Total Weight for Each Season (2022)')
