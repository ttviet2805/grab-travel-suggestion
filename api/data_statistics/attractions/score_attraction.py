import pandas as pd
from transformers import pipeline, AutoTokenizer
import numpy as np

# Use a pretrained model to analyze sentiment
model_name = "distilbert-base-uncased-finetuned-sst-2-english"
sentiment_model = pipeline("sentiment-analysis", model=model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

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

# Function to truncate text to fit the model's maximum token length
def truncate_text(text, max_tokens=512):
    tokens = tokenizer.tokenize(text)
    if len(tokens) > max_tokens:
        tokens = tokens[:max_tokens]
    return tokenizer.convert_tokens_to_string(tokens)

# Function to get weight of a single comment
def get_comment_weight(rating, title, content):
    truncated_title = truncate_text(title, max_tokens=128)
    truncated_content = truncate_text(content, max_tokens=384)
    
    title_sentiment_score = sentiment_model(truncated_title)[0]['score']
    content_sentiment_score = sentiment_model(truncated_content)[0]['score']
    
    weight = calculate_weight_improved(rating, title_sentiment_score, content_sentiment_score)
    return weight

# Function to calculate the average weight for a single attraction
def get_attraction_weight(attraction):
    comments = attraction['review']
    weights = []
    for comment in comments:
        weight = get_comment_weight(comment['rating'], comment['title'], comment['content'])
        weights.append(weight)
    
    # Check if there are valid weights before calculating the average
    if weights:
        average_weight = np.mean(weights)
    else:
        average_weight = 0  # or any default value you consider appropriate
    
    return average_weight