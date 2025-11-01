# Results Page

This directory contains the quiz results page that displays the player's performance after completing a quiz.

## Files

- **page.tsx** - Production results page that fetches real data from Supabase
- **page-mock.tsx** - Mock version with sample data for testing without database
- **README.md** - This file

## Features

### Quiz Summary
- Overall score (out of max possible points)
- Trophy icon and visual score display
- Statistics grid showing:
  - Correct answers count
  - Incorrect answers count
  - Average time per question
  - Accuracy percentage

### XP Progress
- XP earned from the quiz
- Current level and progress bar
- XP required for next level

### Answer Review
- Question-by-question breakdown
- User's answer vs correct answer
- Time taken per question
- Points earned per question
- Explanations (when available)
- Color-coded correct (green) and incorrect (red) answers

### Navigation
- "Play Again" button - restarts the same topic quiz
- "Back to Topics" button - returns to topic selection

## Testing with Mock Data

To test the results page without completing a quiz:

1. **Backup the original page:**
   ```bash
   # Rename page.tsx to page.backup.tsx
   mv app/\(game\)/results/\[sessionId\]/page.tsx app/\(game\)/results/\[sessionId\]/page.backup.tsx
   ```

2. **Use the mock version:**
   ```bash
   # Rename page-mock.tsx to page.tsx
   mv app/\(game\)/results/\[sessionId\]/page-mock.tsx app/\(game\)/results/\[sessionId\]/page.tsx
   ```

3. **Navigate to the mock results:**
   - Visit: `http://localhost:3000/results/any-id-here`
   - The mock page works with any sessionId parameter

4. **Restore the original:**
   ```bash
   # Restore from backup
   mv app/\(game\)/results/\[sessionId\]/page.backup.tsx app/\(game\)/results/\[sessionId\]/page.tsx
   ```

## Mock Data Included

The mock version includes:

- **Session Data:**
  - 7 questions answered
  - 5 correct (71% accuracy)
  - 825 total score (out of 1050 max)
  - 52 seconds total time (~7s average)
  - 165 XP earned

- **User Profile:**
  - Level 5
  - 1,250 total XP
  - 23 games played
  - 161 questions answered

- **Sample Questions:**
  - JavaScript fundamentals topic
  - Mix of correct and incorrect answers
  - Varying time taken (3-9 seconds)
  - Some with explanations, some without

## Production Usage

After a quiz is completed, the practice page automatically navigates to:

```
/results/[sessionId]
```

Where `[sessionId]` is the unique ID from the `game_sessions` table.

The page then fetches:
1. Session data (score, stats, topic info)
2. Answer history (all questions with user responses)
3. User profile (for XP progress display)

## Styling

- Follows Tailwind CSS utility-first approach
- Uses indigo as primary color
- Green for correct answers
- Red for incorrect answers
- Responsive design with mobile-first approach
- Icons from `react-icons/fa`

## Database Dependencies

The production page requires these Supabase tables:
- `game_sessions` - Quiz session data
- `game_answers` - Individual answer records
- `questions` - Question details
- `topics` - Topic information
- `profiles` - User profile and XP data

## Future Enhancements

Potential improvements:
- Share results on social media
- Compare with previous attempts
- Leaderboard integration
- Detailed analytics (strengths/weaknesses)
- Download results as PDF
- Time-based achievements
