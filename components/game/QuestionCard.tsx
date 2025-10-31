interface QuestionCardProps {
    questionText: string
    questionNumber: number
    totalQuestions: number
  }
  
  /*
  * This component is used to display a question card
  * @param questionText - The text of the question
  * @param questionNumber - The number of the question
  * @param totalQuestions - The total number of questions
  * @returns The question card
  * */
  export function QuestionCard({
    questionText,
    questionNumber,
    totalQuestions,
  }: QuestionCardProps) {
    return (
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-2 text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">{questionText}</h2>
      </div>
    )
  }