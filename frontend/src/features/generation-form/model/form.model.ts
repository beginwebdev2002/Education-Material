import { schema, required, min, max, validate, applyWhen } from '@angular/forms/signals';
import { MaterialTypes } from '@shared/models';

export interface GenerationFormModelState {
    subject: string;
    selectedAudience: string;
    selectedLevel: string;
    topic: string;
    formats: Omit<MaterialTypes, 'id'>;
    teachingWeeks: number | null;
    lecturesPerWeek: number | null;
    presentationsPerWeek: number | null;
    testQuestions: number | null;
}

export const initialGenerationForm: GenerationFormModelState = {
    subject: '',
    selectedAudience: 'university',
    selectedLevel: '',
    topic: '',
    formats: {
        program: true,
        lecture: false,
        presentation: false,
        test: false,
    },
    teachingWeeks: 16,
    lecturesPerWeek: 1,
    presentationsPerWeek: 1,
    testQuestions: 100,
};

const INTEGER_MESSAGE = 'Must be a whole number.';

export const generationFormSchema = schema<GenerationFormModelState>((path) => {
    required(path.subject, { message: 'This is a required field.' });
    required(path.selectedLevel, { message: 'This is a required field.' });
    required(path.topic, { message: 'This is a required field.' });

    applyWhen(path.teachingWeeks, ({ valueOf }) => valueOf(path.formats.program), (teachingWeeksPath) => {
        required(teachingWeeksPath, { message: 'Value is required.' });
        min(teachingWeeksPath, 1, { message: 'Must be between 1 and 36.' });
        max(teachingWeeksPath, 36, { message: 'Must be between 1 and 36.' });
        validate(teachingWeeksPath, ({ value }) => !Number.isInteger(value()) ? { kind: 'integer', message: INTEGER_MESSAGE } : undefined);
    });

    applyWhen(path.lecturesPerWeek, ({ valueOf }) => valueOf(path.formats.lecture), (lecturesPath) => {
        required(lecturesPath, { message: 'Value is required.' });
        min(lecturesPath, 0, { message: 'Must be between 0 and 10.' });
        max(lecturesPath, 10, { message: 'Must be between 0 and 10.' });
        validate(lecturesPath, ({ value }) => !Number.isInteger(value()) ? { kind: 'integer', message: INTEGER_MESSAGE } : undefined);
    });

    applyWhen(path.presentationsPerWeek, ({ valueOf }) => valueOf(path.formats.presentation), (presentationsPath) => {
        required(presentationsPath, { message: 'Value is required.' });
        min(presentationsPath, 0, { message: 'Must be between 0 and 10.' });
        max(presentationsPath, 10, { message: 'Must be between 0 and 10.' });
        validate(presentationsPath, ({ value }) => !Number.isInteger(value()) ? { kind: 'integer', message: INTEGER_MESSAGE } : undefined);
    });

    applyWhen(path.testQuestions, ({ valueOf }) => valueOf(path.formats.test), (testQuestionsPath) => {
        required(testQuestionsPath, { message: 'Value is required.' });
        min(testQuestionsPath, 50, { message: 'Must be between 50 and 300.' });
        max(testQuestionsPath, 300, { message: 'Must be between 50 and 300.' });
        validate(testQuestionsPath, ({ value }) => !Number.isInteger(value()) ? { kind: 'integer', message: INTEGER_MESSAGE } : undefined);
    });
});
