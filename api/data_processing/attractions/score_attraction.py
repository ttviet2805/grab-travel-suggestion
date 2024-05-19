import pandas as pd
from transformers import pipeline
import numpy as np

# Assume we have user data
data = {
    "location_1": [
        {"rating": 5, "title": "Amazing Trip", "content": "This trip makes me feel really happy and enjoyable"},
        {"rating": 4, "title": "Great Experience", "content": "I had a wonderful time visiting this place"}
    ],
    "location_2": [
        {"rating": 3, "title": "Average", "content": "The trip was okay, not too bad but not great either"},
        {"rating": 2, "title": "Poor Service", "content": "I was disappointed with the service"},
        {"rating": 1, "title": "Terrible", "content": "This was the worst trip ever"}
    ]
}

# Use a pretrained model to analyze sentiment
sentiment_model = pipeline("sentiment-analysis")

# Sigmoid function to normalize values
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# Improved weight calculation function
def calculate_weight_improved(rating, title_sentiment_score, content_sentiment_score):
    # Higher weight for title
    title_weight = 0.6
    content_weight = 0.4
    
    # Normalize rating and sentiment_score to the range [0, 1]
    normalized_rating = rating / 5.0
    normalized_title_sentiment = sigmoid(title_sentiment_score)
    normalized_content_sentiment = sigmoid(content_sentiment_score)
    
    # Calculate the average sentiment score from title and content with priority weights
    weighted_sentiment_score = (title_weight * normalized_title_sentiment + content_weight * normalized_content_sentiment)
    
    # Calculate weight with adjustment coefficients
    alpha = 0.7
    beta = 0.3
    weight = alpha * normalized_rating + beta * weighted_sentiment_score

    # Scale weight to a range of 100
    return weight * 100

# Create a DataFrame to store results
results = []

for location, comments in data.items():
    weights = []
    for comment in comments:
        rating = comment['rating']
        title_sentiment_score = sentiment_model(comment['title'])[0]['score']
        content_sentiment_score = sentiment_model(comment['content'])[0]['score']
        
        weight = calculate_weight_improved(rating, title_sentiment_score, content_sentiment_score)
        weights.append(weight)
    
    # Calculate the average weight for each location
    average_weight = np.mean(weights)
    results.append({"location": location, "average_weight": average_weight})

# Create a DataFrame from the results
df_results = pd.DataFrame(results)

# Sort locations by average weight
df_results_sorted = df_results.sort_values(by='average_weight', ascending=False)

# Display the results
print(df_results_sorted)
