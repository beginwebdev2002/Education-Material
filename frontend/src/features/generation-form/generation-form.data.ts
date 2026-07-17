export const audienceOptions = [
    {
        key: 'school',
        label: 'generationForm.audience.school'
    },
    {
        key: 'college',
        label: 'generationForm.audience.college'
    },
    {
        key: 'university',
        label: 'generationForm.audience.university'
    },
    {
        key: 'professional',
        label: 'generationForm.audience.professional'
    },
];

// Course level values double as the submitted form value (see selectedLevel/loadDraft/loadFromHistory
// in generation-form.component.ts), so they're kept as fixed English identifiers rather than
// locale-reactive text — translating them would change stored/submitted data when switching language.
export const levelOptions: { [key: string]: string[] } = {
    school: [
        '1st Grade',
        '2nd Grade',
        '3rd Grade',
        '4th Grade',
        '5th Grade',
        '6th Grade',
        '7th Grade',
        '8th Grade',
        '9th Grade',
        '10th Grade',
        '11th Grade'
    ],
    college: [
        '1st Course',
        '2nd Course',
        '3rd Course',
        '4th Course'
    ],
    university: [
        '1st Course',
        '2nd Course',
        '3rd Course',
        '4th Course',
        '5th Course'
    ],
    professional: [
        'Masters Course 1',
        'Masters Course 2',
        'Masters Course 3',
        'Masters Course 4',
        'PhD'
    ]
};
