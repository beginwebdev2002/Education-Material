import { IllustrationNames, IllustrationsData } from "../../../models/illustration.model";



export function getIllustrationData(illustration: IllustrationNames): IllustrationsData {
    const illustrations: IllustrationsData[] = [
        {
            name: "notFound",
            url: "illustrations/not-found.svg",
            alt: 'Resource Not Found Illustration'
        },
        {
            name: "welcome",
            url: 'illustrations/women-on-rocket.svg',
            alt: 'Welcome Illustration'
        },
        {
            name: "materialList",
            url: 'illustrations/document-folders.svg',
            alt: 'Material List Illustration'
        },
        {
            name: "login",
            url: 'illustrations/women-cyber-security.svg',
            alt: 'Login Illustration'
        },
        {
            name: "dashboard",
            url: "illustrations/man-drawing.svg",
            alt: 'Dashboard Illustration'
        },
        {
            name: "emptyState",
            url: 'illustrations/empty-state.svg',
            alt: 'Empty State Illustration'
        }
    ];
    return illustrations.find((item) => item.name === illustration) ?? illustrations[0];
}