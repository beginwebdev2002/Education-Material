export const audienceOptions = [
    {
        key: 'school',
        label: $localize`:@@audienceSchool|Опция выбора аудитории:School`
    },
    {
        key: 'college',
        label: $localize`:@@audienceCollege|Опция выбора аудитории:College`
    },
    {
        key: 'university',
        label: $localize`:@@audienceUniversity|Опция выбора аудитории:University`
    },
    {
        key: 'professional',
        label: $localize`:@@audienceProfessional|Опция выбора аудитории:Professional`
    },
];

export const levelOptions: { [key: string]: string[] } = {
    school: [
        $localize`:@@grade1st:1st Grade`,
        $localize`:@@grade2nd:2nd Grade`,
        $localize`:@@grade3rd:3rd Grade`,
        $localize`:@@grade4th:4th Grade`,
        $localize`:@@grade5th:5th Grade`,
        $localize`:@@grade6th:6th Grade`,
        $localize`:@@grade7th:7th Grade`,
        $localize`:@@grade8th:8th Grade`,
        $localize`:@@grade9th:9th Grade`,
        $localize`:@@grade10th:10th Grade`,
        $localize`:@@grade11th:11th Grade`
    ],
    college: [
        $localize`:@@course1st:1st Course`,
        $localize`:@@course2nd:2nd Course`,
        $localize`:@@course3rd:3rd Course`,
        $localize`:@@course4th:4th Course`
    ],
    university: [
        $localize`:@@course1st:1st Course`, // Перевод будет такой же, но ID может быть одинаковым, если контекст идентичен
        $localize`:@@course2nd:2nd Course`,
        $localize`:@@course3rd:3rd Course`,
        $localize`:@@course4th:4th Course`,
        $localize`:@@course5th:5th Course`
    ],
    professional: [
        $localize`:@@mastersCourse1:Masters Course 1`,
        $localize`:@@mastersCourse2:Masters Course 2`,
        $localize`:@@mastersCourse3:Masters Course 3`,
        $localize`:@@mastersCourse4:Masters Course 4`,
        $localize`:@@phd:PhD`
    ]
};