export interface Notification {
    id: string;
    notification: string;
    procitano: boolean;
    isResponseNeeded: boolean;
    ponavljajuca: boolean;
    vrijeme_prikaza: string;
    isActive: boolean;
    response: any;
    neededAnswers?: { [key: string]: string };
}

export interface Settings {
    onOffCollors: boolean;
    highlightArticle: number;
}

export interface SkupniPrikazKategorije {
    [key: string]: {
        [key: string]: number;
    };
}