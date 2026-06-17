# Fake News and Misinformation Detection ML Service

This is a complete Python machine learning service that classifies news articles as **Real** or **Fake** using Natural Language Processing (NLP), a TF-IDF Vectorizer, and a Logistic Regression model.

## Features

- **NLP Preprocessing**: Lowercasing, punctuation/special character removal, stopword filtering, and tokenization.
- **TF-IDF Vectorization**: Text representation mapping features to word importance.
- **Logistic Regression Model**: Highly efficient, interpretable classification with confidence scores.
- **FastAPI Service**: Serves predictions over a `POST /predict` endpoint.

---

## Directory Structure

```
ml-service/
├── dataset/
│   ├── Fake.csv
│   └── True.csv
├── training/
│   ├── preprocess.py
│   ├── train_model.py
│   ├── evaluate.py
│   └── generate_sample_data.py
├── model/
│   ├── fake_news_model.pkl
│   └── vectorizer.pkl
├── api/
│   └── app.py
├── requirements.txt
└── README.md
```

---

## Setup and Installation

### 1. Install Dependencies

Install all project packages:
```bash
pip install -r ml-service/requirements.txt
```

### 2. Generate Sample Datasets

If you don't have the full Kaggle dataset, run this script to generate synthetic/mock datasets to verify the pipeline:
```bash
python ml-service/training/generate_sample_data.py
```

### 3. Train the Model

Train the TF-IDF Vectorizer and the Logistic Regression model, evaluate the metrics, and serialize the model files:
```bash
python ml-service/training/train_model.py
```

Upon execution, it prints the classification report:
- **Accuracy**
- **Precision**
- **Recall**
- **F1 Score**

---

## Run the FastAPI Server

Launch the web service using Uvicorn:
```bash
uvicorn ml-service.api.app:app --reload
```

The API will be available at: http://127.0.0.1:8000
Interactive docs: http://127.0.0.1:8000/docs

---

## Make Predictions

### Endpoint
`POST /predict`

### Request Body
```json
{
  "title": "Government announces new economic policies to boost growth",
  "text": "The official spokesperson announced that the government has launched a series of economic reforms."
}
```

### Example Curl Request
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
     -H "Content-Type: application/json" \
     -d "{\"title\": \"Breaking: Government introduces reforms\", \"text\": \"Official statement release confirms new growth packages.\"}"
```

### Response
```json
{
  "prediction": "Real",
  "confidence_score": 0.8123
}
```
