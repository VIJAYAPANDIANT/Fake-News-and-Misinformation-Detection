import os
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Import preprocess and evaluate functions
from preprocess import preprocess_text
from evaluate import evaluate_metrics

def train_pipeline():
    # Paths
    true_csv_path = "ml-service/dataset/True.csv"
    fake_csv_path = "ml-service/dataset/Fake.csv"
    model_dir = "ml-service/model"
    
    # Check if dataset exists
    if not os.path.exists(true_csv_path) or not os.path.exists(fake_csv_path):
        raise FileNotFoundError(
            "Datasets not found. Please run training/generate_sample_data.py first to create them."
        )
        
    print("Loading datasets...")
    df_true = pd.read_csv(true_csv_path)
    df_fake = pd.read_csv(fake_csv_path)
    
    # Add label: 1 for Real, 0 for Fake
    df_true['label'] = 1
    df_fake['label'] = 0
    
    # Combine datasets
    df = pd.concat([df_true, df_fake], ignore_index=True)
    
    # Use title + text for prediction
    print("Combining fields and preprocessing text...")
    df['content'] = df['title'].fillna('') + " " + df['text'].fillna('')
    df['processed_content'] = df['content'].apply(preprocess_text)
    
    # Split training and testing sets
    X = df['processed_content']
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # TF-IDF Vectorizer
    print("Vectorizing text using TF-IDF...")
    vectorizer = TfidfVectorizer(max_features=5000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    # Train Logistic Regression
    print("Training Logistic Regression model...")
    model = LogisticRegression(C=1.0, max_iter=1000)
    model.fit(X_train_vec, y_train)
    
    # Evaluate model
    print("Evaluating model...")
    y_pred = model.predict(X_test_vec)
    evaluate_metrics(y_test, y_pred)
    
    # Save model and vectorizer
    os.makedirs(model_dir, exist_ok=True)
    
    model_path = os.path.join(model_dir, "fake_news_model.pkl")
    vectorizer_path = os.path.join(model_dir, "vectorizer.pkl")
    
    print(f"Saving model to {model_path}...")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"Saving vectorizer to {vectorizer_path}...")
    with open(vectorizer_path, 'wb') as f:
        pickle.dump(vectorizer, f)
        
    print("Training pipeline finished successfully!")

if __name__ == "__main__":
    train_pipeline()
