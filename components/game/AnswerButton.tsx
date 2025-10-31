interface AnswerButtonProps {
    answer: string
    onClick: () => void
    disabled: boolean
    selected?: boolean
    isCorrect?: boolean
    showResult?: boolean
  }
  
  /*
  * This component is used to display an answer button
  * @param answer - The answer to the button
  * @param onClick - The function to call when the button is clicked
  * @param disabled - Whether the button is disabled
  * @param selected - Whether the button is selected
  * @param isCorrect - Whether the button is correct
  * @param showResult - Whether the button is showing the result
  * @returns The answer button
  * */
  export function AnswerButton({
    answer,
    onClick,
    disabled,
    selected,
    isCorrect,
    showResult,
  }: AnswerButtonProps) {
    let bgColor = 'bg-white hover:bg-indigo-50'
  
    if (showResult && selected) {
      bgColor = isCorrect ? 'bg-green-100' : 'bg-red-100'
    } else if (selected) {
      bgColor = 'bg-indigo-100'
    }
  
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full rounded-lg border-2 border-gray-300 p-4 text-left text-lg font-medium transition-all ${bgColor} ${
          disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-indigo-500'
        }`}
      >
        {answer}
      </button>
    )
  }