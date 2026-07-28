import { Translations } from '@modules/autocomplete/autocomplete.interface';

export interface InstitutionSeedItem {
    /** Seed-local slug used only to wire subjects.seed.ts's parentInstitutionKeys — never persisted. */
    key: string;
    translations: Translations;
    metadata: { institutionType: 'UNIVERSITY' | 'SCHOOL'; city: string };
}

// Representative real Tajikistan universities and well-known schools/lyceums,
// gathered via web search (see CLAUDE.md / plan doc for scope notes — not a
// claim of exhaustive national coverage; Tajikistan has thousands of schools).
export const INSTITUTIONS_SEED: InstitutionSeedItem[] = [
    // --- Universities ---
    {
        key: 'tnu',
        translations: { en: 'Tajik National University', ru: 'Таджикский национальный университет', tj: 'Донишгоҳи миллии Тоҷикистон' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dushanbe' },
    },
    {
        key: 'ttu',
        translations: { en: 'Tajik Technical University named after academician M.S. Osimi', ru: 'Таджикский технический университет имени академика М.С. Осими', tj: 'Донишгоҳи техникии Тоҷикистон ба номи академик М.С. Осимӣ' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dushanbe' },
    },
    {
        key: 'tsmu',
        translations: { en: 'Avicenna Tajik State Medical University', ru: 'Таджикский государственный медицинский университет имени Абуали ибни Сино', tj: 'Донишгоҳи давлатии тиббии Тоҷикистон ба номи Абӯалӣ ибни Сино' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dushanbe' },
    },
    {
        key: 'tspu',
        translations: { en: 'Tajik State Pedagogical University named after Sadriddin Ayni', ru: 'Таджикский государственный педагогический университет имени Садриддина Айни', tj: 'Донишгоҳи давлатии омӯзгории Тоҷикистон ба номи Садриддин Айнӣ' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dushanbe' },
    },
    {
        key: 'tau',
        translations: { en: 'Tajik Agrarian University named after Shirinsho Shotemur', ru: 'Таджикский аграрный университет имени Шириншо Шотемура', tj: 'Донишгоҳи аграрии Тоҷикистон ба номи Шириншо Шотемур' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dushanbe' },
    },
    {
        key: 'tsuc',
        translations: { en: 'Tajik State University of Commerce', ru: 'Таджикский государственный университет коммерции', tj: 'Донишгоҳи давлатии тиҷорати Тоҷикистон' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dushanbe' },
    },
    {
        key: 'tut',
        translations: { en: 'Technological University of Tajikistan', ru: 'Технологический университет Таджикистана', tj: 'Донишгоҳи технологии Тоҷикистон' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dushanbe' },
    },
    {
        key: 'rtsu',
        translations: { en: 'Russian-Tajik Slavonic University', ru: 'Российско-Таджикский (Славянский) университет', tj: 'Донишгоҳи (Славянии) Россия ва Тоҷикистон' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dushanbe' },
    },
    {
        key: 'sfeu',
        translations: { en: 'State Financial and Economic University of Tajikistan', ru: 'Таджикский государственный финансово-экономический университет', tj: 'Донишгоҳи давлатии молия ва иқтисоди Тоҷикистон' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dushanbe' },
    },
    {
        key: 'tsulbp',
        translations: { en: 'Tajikistan State University of Law, Business and Politics', ru: 'Таджикский государственный университет права, бизнеса и политики', tj: 'Донишгоҳи давлатии ҳуқуқ, бизнес ва сиёсати Тоҷикистон' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Khujand' },
    },
    {
        key: 'thiu',
        translations: { en: 'Tajikistan Humanitarian International University', ru: 'Таджикский международный университет иностранных языков', tj: 'Донишгоҳи байналмилалии забонҳои хориҷии Тоҷикистон' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dushanbe' },
    },
    {
        key: 'apa',
        translations: { en: 'Academy of Public Administration under the President of the Republic of Tajikistan', ru: 'Академия государственного управления при Президенте Республики Таджикистан', tj: 'Академияи идоракунии давлатии назди Президенти Ҷумҳурии Тоҷикистон' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dushanbe' },
    },
    {
        key: 'ies',
        translations: { en: 'Institute of Entrepreneurship and Service', ru: 'Институт предпринимательства и сервиса', tj: 'Донишкадаи соҳибкорӣ ва хизмат' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dushanbe' },
    },
    {
        key: 'tnc',
        translations: { en: 'Tajik National Conservatory', ru: 'Таджикская национальная консерватория', tj: 'Консерваторияи миллии Тоҷикистон' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dushanbe' },
    },
    {
        key: 'khsu',
        translations: { en: 'Khujand State University named after academician Bobojon Ghafurov', ru: 'Худжандский государственный университет имени академика Бободжона Гафурова', tj: 'Донишгоҳи давлатии Хуҷанд ба номи академик Бобоҷон Ғафуров' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Khujand' },
    },
    {
        key: 'khpi',
        translations: { en: 'Khujand Polytechnic Institute of Tajik Technical University', ru: 'Худжандский политехнический институт Таджикского технического университета', tj: 'Донишкадаи политехникии Хуҷанди Донишгоҳи техникии Тоҷикистон' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Khujand' },
    },
    {
        key: 'kulob-su',
        translations: { en: 'Kulob State University named after Abuabdulloh Rudaki', ru: 'Кулябский государственный университет имени Абуабдулло Рудаки', tj: 'Донишгоҳи давлатии Кӯлоб ба номи Абӯабдуллоҳи Рӯдакӣ' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Kulob' },
    },
    {
        key: 'bokhtar-su',
        translations: { en: 'Bokhtar State University named after Nosir Khusrav', ru: 'Бохтарский государственный университет имени Носира Хусрава', tj: 'Донишгоҳи давлатии Бохтар ба номи Носири Хусрав' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Bokhtar' },
    },
    {
        key: 'dangara-su',
        translations: { en: 'Dangara State University', ru: 'Дангаринский государственный университет', tj: 'Донишгоҳи давлатии Данғара' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Dangara' },
    },
    {
        key: 'khorugh-su',
        translations: { en: 'Khorugh State University named after Musajon Nazarshoyev', ru: 'Хорогский государственный университет имени Мусаджона Назаршоева', tj: 'Донишгоҳи давлатии Хоруғ ба номи Мусоҷон Назаршоев' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Khorugh' },
    },
    {
        key: 'uca-khorog',
        translations: { en: 'University of Central Asia (Khorog Campus)', ru: 'Университет Центральной Азии (кампус в Хороге)', tj: 'Донишгоҳи Осиёи Марказӣ (маркази Хоруғ)' },
        metadata: { institutionType: 'UNIVERSITY', city: 'Khorugh' },
    },

    // --- Schools / lyceums ---
    {
        key: 'presidential-lyceum-dushanbe',
        translations: { en: 'Presidential Lyceum for Gifted Students', ru: 'Президентский лицей для одарённых детей', tj: 'Литсейи президентӣ барои хонандагони болаёқат' },
        metadata: { institutionType: 'SCHOOL', city: 'Dushanbe' },
    },
    {
        key: 'lyceum-ehson',
        translations: { en: 'Lyceum "Ehson"', ru: 'Лицей "Эҳсон"', tj: 'Литсейи "Эҳсон"' },
        metadata: { institutionType: 'SCHOOL', city: 'Dushanbe' },
    },
    {
        key: 'lyceum-gifted-dushanbe',
        translations: { en: 'State Lyceum for Gifted Pupils, Dushanbe', ru: 'Государственный лицей для одарённых учащихся, Душанбе', tj: 'Литсейи давлатии хонандагони болаёқат, Душанбе' },
        metadata: { institutionType: 'SCHOOL', city: 'Dushanbe' },
    },
    {
        key: 'lyceum-economic-dushanbe',
        translations: { en: 'Lyceum of Economic Direction for Gifted Pupils, Dushanbe', ru: 'Лицей экономического направления для одарённых учащихся, Душанбе', tj: 'Литсейи самти иқтисодӣ барои хонандагони болаёқат, Душанбе' },
        metadata: { institutionType: 'SCHOOL', city: 'Dushanbe' },
    },
    {
        key: 'suvorov-military-lyceum',
        translations: { en: 'Mastibek Tashmukhamedov Military Lyceum (Suvorov School)', ru: 'Военный лицей имени Мастибека Ташмухамедова (Суворовское училище)', tj: 'Литсейи ҳарбӣ ба номи Мастибек Тошмуҳамедов (Мактаби Суворов)' },
        metadata: { institutionType: 'SCHOOL', city: 'Dushanbe' },
    },
    {
        key: 'qsi-dushanbe',
        translations: { en: 'QSI International School of Dushanbe', ru: 'Международная школа QSI в Душанбе', tj: 'Мактаби байналмилалии QSI дар Душанбе' },
        metadata: { institutionType: 'SCHOOL', city: 'Dushanbe' },
    },
    {
        key: 'lyceum-gifted-khujand',
        translations: { en: 'State Lyceum for Gifted Pupils, Khujand', ru: 'Государственный лицей для одарённых учащихся, Худжанд', tj: 'Литсейи давлатии хонандагони болаёқат, Хуҷанд' },
        metadata: { institutionType: 'SCHOOL', city: 'Khujand' },
    },
    {
        key: 'gymnasium-kavsar',
        translations: { en: 'Gymnasium "Kavsar", Khujand', ru: 'Гимназия "Кавсар", Худжанд', tj: 'Гимназияи "Кавсар", Хуҷанд' },
        metadata: { institutionType: 'SCHOOL', city: 'Khujand' },
    },
    {
        key: 'aga-khan-lyceum-khorog',
        translations: { en: 'Aga Khan Lyceum, Khorog', ru: 'Лицей Ага Хана, Хорог', tj: 'Литсейи Оғохон, Хоруғ' },
        metadata: { institutionType: 'SCHOOL', city: 'Khorugh' },
    },
    {
        key: 'school-1-dushanbe',
        translations: { en: 'Secondary School No. 1, Dushanbe', ru: 'Средняя школа №1, Душанбе', tj: 'Мактаби миёнаи №1, Душанбе' },
        metadata: { institutionType: 'SCHOOL', city: 'Dushanbe' },
    },
    {
        key: 'school-2-dushanbe',
        translations: { en: 'Secondary School No. 2, Dushanbe', ru: 'Средняя школа №2, Душанбе', tj: 'Мактаби миёнаи №2, Душанбе' },
        metadata: { institutionType: 'SCHOOL', city: 'Dushanbe' },
    },
    {
        key: 'school-1-khujand',
        translations: { en: 'Secondary School No. 1, Khujand', ru: 'Средняя школа №1, Худжанд', tj: 'Мактаби миёнаи №1, Хуҷанд' },
        metadata: { institutionType: 'SCHOOL', city: 'Khujand' },
    },
    {
        key: 'school-1-bokhtar',
        translations: { en: 'Secondary School No. 1, Bokhtar', ru: 'Средняя школа №1, Бохтар', tj: 'Мактаби миёнаи №1, Бохтар' },
        metadata: { institutionType: 'SCHOOL', city: 'Bokhtar' },
    },
    {
        key: 'school-1-kulob',
        translations: { en: 'Secondary School No. 1, Kulob', ru: 'Средняя школа №1, Куляб', tj: 'Мактаби миёнаи №1, Кӯлоб' },
        metadata: { institutionType: 'SCHOOL', city: 'Kulob' },
    },
];
