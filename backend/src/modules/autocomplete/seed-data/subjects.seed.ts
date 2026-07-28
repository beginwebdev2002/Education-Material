import { Translations } from '@modules/autocomplete/autocomplete.interface';

export interface SubjectSeedItem {
    translations: Translations;
    metadata: { subjectKind: 'SCHOOL_SUBJECT' | 'SPECIALIZATION' };
    /** References InstitutionSeedItem.key from institutions.seed.ts. Omitted/empty = universal (applies to every institution). */
    parentInstitutionKeys?: string[];
}

// Standard national-curriculum school subjects (universal — no parentInstitutionKeys)
// plus real specializations/faculties gathered via web search from named Tajik
// universities, linked to the institutions that document-ly offer them.
export const SUBJECTS_SEED: SubjectSeedItem[] = [
    // --- School subjects (universal, apply to every school) ---
    { translations: { en: 'Tajik Language', ru: 'Таджикский язык', tj: 'Забони тоҷикӣ' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Tajik Literature', ru: 'Таджикская литература', tj: 'Адабиёти тоҷик' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Russian Language', ru: 'Русский язык', tj: 'Забони русӣ' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Russian Literature', ru: 'Русская литература', tj: 'Адабиёти рус' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'English Language', ru: 'Английский язык', tj: 'Забони англисӣ' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Algebra', ru: 'Алгебра', tj: 'Алгебра' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Geometry', ru: 'Геометрия', tj: 'Геометрия' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Physics', ru: 'Физика', tj: 'Физика' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Chemistry', ru: 'Химия', tj: 'Химия' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Biology', ru: 'Биология', tj: 'Биология' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Geography', ru: 'География', tj: 'Ҷуғрофия' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'History of Tajikistan', ru: 'История таджикского народа', tj: 'Таърихи халқи тоҷик' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'World History', ru: 'Всемирная история', tj: 'Таърихи ҷаҳон' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Informatics', ru: 'Информатика', tj: 'Информатика' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Social Studies', ru: 'Обществознание', tj: 'Ҷомеашиносӣ' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Physical Education', ru: 'Физическая культура', tj: 'Тарбияи ҷисмонӣ' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Fine Arts', ru: 'Изобразительное искусство', tj: 'Санъати тасвирӣ' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Music', ru: 'Музыка', tj: 'Мусиқӣ' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Technology', ru: 'Технология', tj: 'Технология' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },
    { translations: { en: 'Basics of Life Safety', ru: 'Основы безопасности жизнедеятельности', tj: 'Асосҳои бехатарии ҳаёт' }, metadata: { subjectKind: 'SCHOOL_SUBJECT' } },

    // --- University specializations: Tajik National University (tnu) ---
    { translations: { en: 'Biology', ru: 'Биология', tj: 'Биология' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu', 'khsu'] },
    { translations: { en: 'Physics', ru: 'Физика', tj: 'Физика' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu', 'khsu'] },
    { translations: { en: 'Chemistry', ru: 'Химия', tj: 'Химия' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu', 'khsu'] },
    { translations: { en: 'Mathematics and Mechanics', ru: 'Математика и механика', tj: 'Математика ва механика' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu'] },
    { translations: { en: 'Geology', ru: 'Геология', tj: 'Геология' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu'] },
    { translations: { en: 'International Relations', ru: 'Международные отношения', tj: 'Муносиботи байналмилалӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu', 'rtsu', 'tsulbp'] },
    { translations: { en: 'History', ru: 'История', tj: 'Таърих' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu', 'khsu'] },
    { translations: { en: 'Law', ru: 'Юриспруденция', tj: 'Ҳуқуқшиносӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu', 'khsu', 'tsulbp', 'rtsu', 'apa'] },
    { translations: { en: 'Philosophy', ru: 'Философия', tj: 'Фалсафа' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu'] },
    { translations: { en: 'Tajik Philology', ru: 'Таджикская филология', tj: 'Филологияи тоҷик' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu', 'khsu', 'tspu'] },
    { translations: { en: 'Russian Philology', ru: 'Русская филология', tj: 'Филологияи рус' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu', 'rtsu'] },
    { translations: { en: 'Asian and European Languages', ru: 'Языки стран Азии и Европы', tj: 'Забонҳои Осиё ва Аврупо' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu', 'thiu'] },
    { translations: { en: 'Journalism', ru: 'Журналистика', tj: 'Журналистика' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu', 'rtsu'] },
    { translations: { en: 'Economics and Management', ru: 'Экономика и управление', tj: 'Иқтисод ва идоракунӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu', 'khsu', 'sfeu'] },
    { translations: { en: 'Finance and Economics', ru: 'Финансы и экономика', tj: 'Молия ва иқтисод' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu', 'sfeu'] },
    { translations: { en: 'Accounting and Economics', ru: 'Бухгалтерский учёт и экономика', tj: 'Баҳисобгирии муҳосибӣ ва иқтисод' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnu', 'sfeu', 'tsuc'] },

    // --- Medicine: Avicenna Tajik State Medical University (tsmu) ---
    { translations: { en: 'General Medicine', ru: 'Лечебное дело', tj: 'Табобат' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tsmu'] },
    { translations: { en: 'Pediatrics', ru: 'Педиатрия', tj: 'Педиатрия' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tsmu'] },
    { translations: { en: 'Dentistry', ru: 'Стоматология', tj: 'Стоматология' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tsmu'] },
    { translations: { en: 'Pharmacy', ru: 'Фармация', tj: 'Фармасия' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tsmu'] },
    { translations: { en: 'Preventive Medicine', ru: 'Медико-профилактическое дело', tj: 'Корҳои тиббию профилактикӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tsmu'] },

    // --- Engineering/Technology: Tajik Technical University (ttu) + Khujand Polytechnic (khpi) ---
    { translations: { en: 'Power Engineering', ru: 'Энергетика', tj: 'Энергетика' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['ttu', 'khpi'] },
    { translations: { en: 'Mechanical Engineering', ru: 'Машиностроение', tj: 'Мошинсозӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['ttu', 'khpi'] },
    { translations: { en: 'Civil Engineering', ru: 'Строительство', tj: 'Сохтмон' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['ttu', 'khpi'] },
    { translations: { en: 'Architecture', ru: 'Архитектура', tj: 'Меъморӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['ttu', 'khpi'] },
    { translations: { en: 'Electrical Engineering', ru: 'Электротехника', tj: 'Электротехника' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['ttu', 'khpi'] },
    { translations: { en: 'Telecommunications Engineering', ru: 'Телекоммуникационные технологии', tj: 'Технологияҳои телекоммуникатсионӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['ttu'] },
    { translations: { en: 'Information Technology', ru: 'Информационные технологии', tj: 'Технологияи иттилоотӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['ttu', 'khpi', 'khsu'] },
    { translations: { en: 'Transport Engineering', ru: 'Транспортное строительство', tj: 'Сохтмони нақлиётӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['ttu'] },
    { translations: { en: 'Chemical Engineering and Metallurgy', ru: 'Химическая технология и металлургия', tj: 'Технологияи химиявӣ ва металлургия' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['ttu'] },
    { translations: { en: 'Textile Technology', ru: 'Технология текстильной промышленности', tj: 'Технологияи саноати нассоҷӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['khpi'] },
    { translations: { en: 'Business Engineering and Management', ru: 'Инженерный бизнес и управление', tj: 'Бизнеси муҳандисӣ ва идоракунӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['ttu'] },

    // --- Pedagogy: Tajik State Pedagogical University (tspu) ---
    { translations: { en: 'Primary Education', ru: 'Начальное образование', tj: 'Таҳсилоти ибтидоӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tspu'] },
    { translations: { en: 'Preschool Education', ru: 'Дошкольное образование', tj: 'Таҳсилоти томактабӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tspu'] },
    { translations: { en: 'Special Education', ru: 'Специальное (дефектологическое) образование', tj: 'Таҳсилоти махсус (дефектологӣ)' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tspu'] },
    { translations: { en: 'Pedagogy and Psychology', ru: 'Педагогика и психология', tj: 'Педагогика ва психология' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tspu'] },
    { translations: { en: 'Foreign Language Teaching', ru: 'Преподавание иностранного языка', tj: 'Таълими забони хориҷӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tspu', 'thiu'] },
    { translations: { en: 'Mathematics Teaching', ru: 'Преподавание математики', tj: 'Таълими математика' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tspu'] },
    { translations: { en: 'Physical Education Teaching', ru: 'Физическое воспитание', tj: 'Тарбияи ҷисмонӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tspu'] },

    // --- Agriculture: Tajik Agrarian University (tau) ---
    { translations: { en: 'Agronomy', ru: 'Агрономия', tj: 'Агрономия' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tau'] },
    { translations: { en: 'Veterinary Medicine', ru: 'Ветеринария', tj: 'Ветеринария' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tau'] },
    { translations: { en: 'Animal Science (Zootechny)', ru: 'Зоотехния', tj: 'Зоотехния' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tau'] },
    { translations: { en: 'Agricultural Engineering', ru: 'Сельскохозяйственная инженерия', tj: 'Муҳандисии кишоварзӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tau', 'khpi'] },
    { translations: { en: 'Land Management', ru: 'Землеустройство', tj: 'Заминсозӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tau'] },
    { translations: { en: 'Forestry', ru: 'Лесное хозяйство', tj: 'Хоҷагии ҷангал' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tau'] },
    { translations: { en: 'Food Technology', ru: 'Технология пищевых продуктов', tj: 'Технологияи маҳсулоти хӯрокворӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tau', 'tut'] },

    // --- Commerce: Tajik State University of Commerce (tsuc) ---
    { translations: { en: 'Commerce', ru: 'Коммерция', tj: 'Тиҷорат' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tsuc'] },
    { translations: { en: 'Marketing', ru: 'Маркетинг', tj: 'Маркетинг' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tsuc', 'sfeu'] },
    { translations: { en: 'Trade Economics', ru: 'Экономика торговли', tj: 'Иқтисоди тиҷорат' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tsuc'] },
    { translations: { en: 'Hotel and Tourism Management', ru: 'Гостиничное дело и туризм', tj: 'Меҳмонхонадорӣ ва туризм' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tsuc', 'ies'] },
    { translations: { en: 'Customs Affairs', ru: 'Таможенное дело', tj: 'Корҳои гумрукӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tsuc'] },

    // --- Finance: State Financial and Economic University (sfeu) ---
    { translations: { en: 'Finance and Credit', ru: 'Финансы и кредит', tj: 'Молия ва қарз' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['sfeu'] },
    { translations: { en: 'Banking', ru: 'Банковское дело', tj: 'Бонкдорӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['sfeu'] },
    { translations: { en: 'Taxation', ru: 'Налогообложение', tj: 'Андозбандӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['sfeu'] },
    { translations: { en: 'Public Finance Management', ru: 'Управление государственными финансами', tj: 'Идоракунии молияи давлатӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['sfeu', 'apa'] },

    // --- Humanities / languages: Tajikistan Humanitarian International University (thiu) ---
    { translations: { en: 'English Philology', ru: 'Английская филология', tj: 'Филологияи англисӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['thiu'] },
    { translations: { en: 'German Philology', ru: 'Немецкая филология', tj: 'Филологияи олмонӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['thiu'] },
    { translations: { en: 'French Philology', ru: 'Французская филология', tj: 'Филологияи фаронсавӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['thiu'] },
    { translations: { en: 'Translation Studies', ru: 'Переводоведение', tj: 'Тарҷумашиносӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['thiu', 'rtsu'] },
    { translations: { en: 'Oriental Studies', ru: 'Востоковедение', tj: 'Шарқшиносӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['thiu', 'tnu'] },

    // --- Entrepreneurship / service (ies) ---
    { translations: { en: 'Entrepreneurship', ru: 'Предпринимательство', tj: 'Соҳибкорӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['ies'] },
    { translations: { en: 'Service Management', ru: 'Управление сервисом', tj: 'Идоракунии хизматрасонӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['ies'] },
    { translations: { en: 'Tourism', ru: 'Туризм', tj: 'Туризм' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['ies', 'tsuc'] },

    // --- Music / arts: Tajik National Conservatory (tnc) ---
    { translations: { en: 'Music Performance', ru: 'Музыкальное исполнительство', tj: 'Иҷрокунии мусиқӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnc'] },
    { translations: { en: 'Musicology', ru: 'Музыковедение', tj: 'Мусиқишиносӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnc'] },
    { translations: { en: 'Choral Conducting', ru: 'Хоровое дирижирование', tj: 'Дирижёрии хор' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnc'] },
    { translations: { en: 'Choreography', ru: 'Хореография', tj: 'Хореография' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tnc'] },

    // --- Public administration / political science (apa) ---
    { translations: { en: 'Public Administration', ru: 'Государственное управление', tj: 'Идоракунии давлатӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['apa'] },
    { translations: { en: 'Political Science', ru: 'Политология', tj: 'Сиёсатшиносӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['apa', 'tnu'] },
    { translations: { en: 'Business Administration', ru: 'Управление бизнесом', tj: 'Идоракунии бизнес' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['tsulbp', 'sfeu'] },

    // --- Regional comprehensive universities: Kulob, Bokhtar, Dangara, Khorugh, UCA ---
    { translations: { en: 'Regional Economics', ru: 'Региональная экономика', tj: 'Иқтисоди минтақавӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['kulob-su', 'bokhtar-su', 'dangara-su'] },
    { translations: { en: 'Cotton Growing and Agro-Technology', ru: 'Хлопководство и агротехнологии', tj: 'Пахтакорӣ ва агротехнология' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['bokhtar-su', 'dangara-su'] },
    { translations: { en: 'Environmental Management', ru: 'Управление природопользованием', tj: 'Идоракунии истифодаи табиат' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['uca-khorog', 'khorugh-su'] },
    { translations: { en: 'Development Studies', ru: 'Исследования развития', tj: 'Омӯзиши рушд' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['uca-khorog'] },
    { translations: { en: 'Mountain Studies', ru: 'Горные исследования', tj: 'Кӯҳшиносӣ' }, metadata: { subjectKind: 'SPECIALIZATION' }, parentInstitutionKeys: ['uca-khorog', 'khorugh-su'] },
];
