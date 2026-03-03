import json
import random

# Read the word list
with open('app/data/word_list.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Parse the words
words = []
for line in lines:
    parts = line.strip().split('\t')
    if len(parts) == 3:
        number, word, meaning = parts
        words.append({
            'number': int(number),
            'word': word,
            'meaning': meaning
        })

# Create quiz questions
quiz_questions = []

# To ensure even distribution of answers
answer_positions = ['A', 'B', 'C', 'D'] * 250  # 1000 questions
random.shuffle(answer_positions)

for i, word_data in enumerate(words):
    number = word_data['number']
    word = word_data['word']
    correct_meaning = word_data['meaning']
    
    # Get the correct answer position for this question
    correct_position = answer_positions[i]
    
    # Get 3 random incorrect meanings (from other words)
    other_words = [w for w in words if w['number'] != number]
    incorrect_meanings = random.sample([w['meaning'] for w in other_words], 3)
    
    # Create options with the correct answer at the designated position
    options = {}
    meanings = incorrect_meanings.copy()
    
    # Place correct answer at the designated position
    for pos in ['A', 'B', 'C', 'D']:
        if pos == correct_position:
            options[pos] = correct_meaning
        else:
            options[pos] = meanings.pop(0)
    
    quiz_questions.append({
        'number': number,
        'title': word,
        'options': options,
        'answer': correct_position
    })

# Write to JSON file
with open('app/data/english.json', 'w', encoding='utf-8') as f:
    json.dump(quiz_questions, f, ensure_ascii=False, indent=2)

print(f"Generated {len(quiz_questions)} quiz questions")

# Verify answer distribution
answer_counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
for q in quiz_questions:
    answer_counts[q['answer']] += 1

print("Answer distribution:")
for answer, count in answer_counts.items():
    print(f"  {answer}: {count}")
