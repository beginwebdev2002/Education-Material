export interface illustrations {
    notFound: string;
    welcome: string;
    materialList: string;
    login: string;
    dashboard: string;
    emptyState: string;
}
export type IllustrationNames = keyof illustrations;
export interface IllustrationsData {
    name: IllustrationNames;
    url: string;
    alt: string;
}