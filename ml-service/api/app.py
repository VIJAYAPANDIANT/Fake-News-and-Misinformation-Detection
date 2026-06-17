import os
import pickle
import sys
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Add training folder to python path to import preprocess_text
current_dir = os.path.dirname(os.path.abspath(__file__))
training_dir = os.path.abspath(os.path.join(current_dir, '..', 'training'))
if training_dir not in sys.path:
    sys.path.insert(0, training_dir)
from preprocess import preprocess_text

app = FastAPI(
    title="Fake News Detection API",
    description="A service to predict whether a news article is Real or Fake based on NLP and Logistic Regression.",
    version="1.0.0"
)

# Global variables for model and vectorizer
model = None
vectorizer = None

class PredictionRequest(BaseModel):
    title: str = ""
    text: str

class PredictionResponse(BaseModel):
    prediction: str
    confidence_score: float

@app.on_event("startup")
def load_model_artifacts():
    global model, vectorizer
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.abspath(os.path.join(current_dir, '..', 'model', 'fake_news_model.pkl'))
    vectorizer_path = os.path.abspath(os.path.join(current_dir, '..', 'model', 'vectorizer.pkl'))
    
    if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
        raise RuntimeError(
            f"Model artifacts not found. Checked: \n- {model_path}\n- {vectorizer_path}"
        )
        
    print(f"Loading model from {model_path}...")
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
        
    print(f"Loading vectorizer from {vectorizer_path}...")
    with open(vectorizer_path, 'rb') as f:
        vectorizer = pickle.load(f)
        
    print("Model artifacts loaded successfully.")

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "Fake News Detection API"}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if model is None or vectorizer is None:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
        
    if not request.text.strip() and not request.title.strip():
        raise HTTPException(status_code=400, detail="Please provide title or text.")
        
    # Combine title and text in the same way it was trained
    combined_content = f"{request.title} {request.text}"
    
    # Preprocess
    clean_content = preprocess_text(combined_content)
    
    # Vectorize
    vectorized_input = vectorizer.transform([clean_content])
    
    # Predict probabilities and class
    probabilities = model.predict_proba(vectorized_input)[0]  # shape: [P(Fake), P(Real)]
    prediction_class = model.predict(vectorized_input)[0]       # 0 (Fake) or 1 (Real)
    
    # Map class to label
    prediction_label = "Real" if prediction_class == 1 else "Fake"
    
    # Get confidence (probability of the predicted class)
    confidence = float(probabilities[prediction_class])
    
    return PredictionResponse(
        prediction=prediction_label,
        confidence_score=round(confidence, 4)
    )
