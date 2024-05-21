import json
from datetime import datetime
import matplotlib.pyplot as plt

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

def calculate_weights_by_tag(data, target_year):
    tag_weights = {}
    for attraction in data:
        for tag in attraction['tag_split']:
            if tag not in tag_weights:
                tag_weights[tag] = 0
            for review in attraction['review']:
                review_time = review['time'].strip()
                if review_time:
                    try:
                        review_year = datetime.strptime(review_time, '%b %Y').year
                        if review_year == target_year:
                            score = review['score']
                            weight = score - 50  # Calculate weight based on the new rule
                            tag_weights[tag] += weight
                    except ValueError:
                        print(f"Error parsing date: {review_time}")
    return tag_weights

def get_top_tags(tag_weights, top_n=10):
    sorted_tags = sorted(tag_weights.items(), key=lambda x: x[1], reverse=True)
    top_tags = sorted_tags[:top_n]
    other_weight = sum(weight for tag, weight in sorted_tags[top_n:])
    if other_weight > 0:
        top_tags.append(('Other', other_weight))
    return dict(top_tags)

def plot_pie_chart(tag_weights, title):
    tags = list(tag_weights.keys())
    weights = list(tag_weights.values())

    fig, ax = plt.subplots(figsize=(10, 8))
    wedges, texts, autotexts = ax.pie(weights, labels=tags, autopct='%1.1f%%', startangle=140, colors=plt.cm.tab20.colors)

    # Draw a legend
    ax.legend(wedges, tags, title="Tags", loc="center left", bbox_to_anchor=(1, 0, 0.5, 1))

    plt.setp(autotexts, size=10, weight="bold")
    ax.set_title(title)

    plt.show()

# Main execution
data = read_json_file('score_reviews.json')

# Calculate and plot for 2023
tag_weights_2023 = calculate_weights_by_tag(data, 2023)
top_tag_weights_2023 = get_top_tags(tag_weights_2023)
plot_pie_chart(top_tag_weights_2023, 'Distribution of Total Weights by Tag (2023)')

# Calculate and plot for 2024
tag_weights_2024 = calculate_weights_by_tag(data, 2024)
top_tag_weights_2024 = get_top_tags(tag_weights_2024)
plot_pie_chart(top_tag_weights_2024, 'Distribution of Total Weights by Tag (2024)')
