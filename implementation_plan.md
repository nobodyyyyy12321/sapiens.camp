# 2000-Word Vocabulary Test Implementation Plan

Build a vocabulary test page (`english_2000.php`) that mimics the functionality and aesthetic of the [sapiens.camp/english/2000](https://www.sapiens.camp/english/2000) test.

## Proposed Changes

### [Frontend] Vocabulary Test Page

#### [NEW] [english_2000.php](file:///usr/data/sapienscamp_php/english_2000.php)
- Create a new PHP file for the vocabulary test.
- **Layout**:
  - Header with title, progress, and a "Submit" (交卷) button.
  - Main section with a vocabulary card displaying the target word and an audio play button icon.
  - Four large buttons for multiple-choice options (A, B, C, D) with parts of speech and definitions.
  - Bottom navigation/back button.
- **Logic (JavaScript)**:
  - `vocabularyData`: A JSON-like array containing words, parts of speech, and definitions.
  - `loadQuestion()`: Selects a word, shuffles it with 3 other random definitions as decoys.
  - `handleSelect()`: Records the user's choice and advances to the next question.
  - `showResults()`: Displays the final score and a breakdown of correct/incorrect answers.

### [Integration] Main Page Link

#### [MODIFY] [index.php](file:///usr/data/sapienscamp_php/index.php)
- Update the "英文" (English) button to link to `english_2000.php` instead of [under_construction.php](file:///usr/data/sapienscamp_php/under_construction.php).

## Verification Plan

### Automated Tests
- Refresh the page to ensure questions are randomized.
- Click through a set of questions and verify the results page displays the correct score.
- Check that the "Submit" button works as expected.

### Manual Verification
- Verify the layout matches the [reference](https://www.sapiens.camp/english/2000).
- Ensure the "Back" button correctly returns to the home page.
