export type ExerciseOption = {
  id: string;
  label: string;
  explanation: string;
};

export type Exercise = {
  id: string;
  moduleId: string;
  category: 'phishing' | 'social-engineering';
  title: string;
  introduction: string;
  scenario: {
    kind: 'sms' | 'link' | 'call';
    label: string;
    sender: string;
    message: string;
    address?: string;
  };
  question: string;
  options: readonly ExerciseOption[];
  correctOptionId: string;
  takeaway: string;
};
