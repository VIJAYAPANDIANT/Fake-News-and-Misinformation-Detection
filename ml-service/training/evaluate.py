from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report

def evaluate_metrics(y_true, y_pred):
    """
    Evaluates classification performance and prints metrics:
    - Accuracy
    - Precision
    - Recall
    - F1 Score
    """
    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred, average='binary')
    recall = recall_score(y_true, y_pred, average='binary')
    f1 = f1_score(y_true, y_pred, average='binary')
    
    print("\n================ MODEL EVALUATION METRICS ================")
    print(f"Accuracy:  {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1 Score:  {f1:.4f}")
    print("==========================================================\n")
    
    print("Classification Report:")
    print(classification_report(y_true, y_pred, target_names=['Fake', 'Real']))
    
    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1_score": f1
    }
