import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

import tempfile

# Configure writable directory for NLTK on serverless read-only filesystems
nltk_dir = os.path.join(tempfile.gettempdir(), 'nltk_data')
os.makedirs(nltk_dir, exist_ok=True)
if nltk_dir not in nltk.data.path:
    nltk.data.path.append(nltk_dir)

# Ensure necessary NLTK datasets are downloaded
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', download_dir=nltk_dir, quiet=True)

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', download_dir=nltk_dir, quiet=True)

# Define custom list fallback if download fails or is restricted
try:
    STOP_WORDS = set(stopwords.words('english'))
except Exception:
    # A basic fallback list of common English stop words
    STOP_WORDS = set([
        "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", 
        "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", 
        "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", 
        "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", 
        "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", 
        "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", 
        "with", "about", "against", "between", "into", "through", "during", "before", "after", 
        "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", 
        "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", 
        "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", 
        "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", 
        "should", "now"
    ])

def preprocess_text(text: str) -> str:
    """
    Performs NLP preprocessing:
    1. Lowercase conversion
    2. Remove punctuation and special characters
    3. Tokenization
    4. Remove stop words
    """
    if not isinstance(text, str):
        return ""
    
    # 1. Lowercase conversion
    text = text.lower()
    
    # 2. Remove punctuation
    # Create translation table to remove punctuation
    translator = str.maketrans('', '', string.punctuation)
    text = text.translate(translator)
    
    # Also clean extra spaces/newlines
    text = re.sub(r'\s+', ' ', text).strip()
    
    # 3. Tokenization
    try:
        tokens = word_tokenize(text)
    except Exception:
        # Simple split fallback if word_tokenize fails
        tokens = text.split()
        
    # 4. Remove stop words
    filtered_tokens = [word for word in tokens if word not in STOP_WORDS]
    
    # Join tokens back to a single string for TF-IDF Vectorizer
    return " ".join(filtered_tokens)
