import { cn } from '@/lib/cn'
import type { InterviewQuestion as QuestionType } from '../config/questions'
import { AnswerCard } from './AnswerCard'

/** Convert index to letter prefix (0 → "A", 1 → "B", etc.) */
function getLetterPrefix(index: number): string {
  return String.fromCharCode(65 + index)
}

interface InterviewQuestionProps {
  question: QuestionType
  currentValue?: string
  disabled?: boolean
  onAnswer: (questionId: string, value: string) => void
  className?: string
}

export function InterviewQuestion({
  question,
  currentValue,
  disabled = false,
  onAnswer,
  className,
}: InterviewQuestionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{question.question}</h2>
        {question.subtitle && <p className="text-muted-foreground text-sm">{question.subtitle}</p>}
      </div>
      <div className="flex flex-col gap-2">
        {question.options.map((option, index) => (
          <AnswerCard
            key={option.value}
            prefix={getLetterPrefix(index)}
            label={option.label}
            value={option.value}
            selected={currentValue === option.value}
            disabled={disabled}
            onSelect={(value) => onAnswer(question.id, value)}
          />
        ))}
      </div>
    </div>
  )
}
