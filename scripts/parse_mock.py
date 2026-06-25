import re
import json
import os
import sys

html_path = r'C:\Users\hp\.gemini\antigravity\brain\efffd16c-212d-4474-b4f7-58a433db6d63\.system_generated\steps\6687\content.md'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

from bs4 import BeautifulSoup
soup = BeautifulSoup(html, 'html.parser')

text = soup.get_text(separator=' ', strip=True)

# Find all occurrences of Q1., Q2., etc.
# Pattern: "Q1. What is ServiceNow? ServiceNow is a cloud-based platform..."
# We can use regex: Q\d+\. (.*?)\? (.*?)(?=Q\d+\. |2\. 50 Self-Preparation|$)

matches = re.finditer(r'Q(\d+)\.\s*(.*?\?)\s*(.*?)(?=Q\d+\.\s|2\.\s*50\s*Self-Preparation|$)', text, re.IGNORECASE | re.DOTALL)

questions = []
for m in matches:
    q_num = m.group(1)
    q_text = m.group(2).strip()
    a_text = m.group(3).strip()
    
    # ensure it's not grabbing too much
    if len(a_text) > 2000:
        a_text = a_text[:2000] + "..."
        
    questions.append({
        "id": f"q{q_num}",
        "question_text": q_text,
        "question_type": "short_answer",
        "options": [],
        "correct_options": [],
        "explanation": a_text
    })

print(f"Extracted {len(questions)} questions")

# Distribute them into modules of 50 questions each
modules = []
chunk_size = 50
for i in range(0, len(questions), chunk_size):
    chunk = questions[i:i+chunk_size]
    modules.append({
        "name": f"Module {i//chunk_size + 1} (Q{chunk[0]['id'][1:]}-Q{chunk[-1]['id'][1:]})",
        "questions": chunk
    })

data = {
    "title": "Mock Interviews",
    "modules": modules
}

os.makedirs('client/public/content/interview-prep/mock', exist_ok=True)
with open('client/public/content/interview-prep/mock/data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print("Saved to client/public/content/interview-prep/mock/data.json")
