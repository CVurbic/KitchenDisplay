export function getStoredData<T>(key: string, defaultValue: T): T {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
}

export function setStoredData(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
}

export function uncommentParentElement(): void {
    /*    const commentedElement = document.querySelector('div[style*="display: none;"]');
       if (commentedElement) {
           (commentedElement as HTMLElement).style.display = 'block';
       } */
}

export function handleSkupniPrikaz(): void {
    const skupniPrikazButton = document.querySelector('button.btn.btn-primary[onclick*="skupniPrikaz"]');
    if (skupniPrikazButton) {
        (skupniPrikazButton as HTMLElement).click();
    }
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: number | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
}

export function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function retryAsync<T>(
    fn: () => Promise<T>,
    maxAttempts: number,
    delay: number
): Promise<T> {
    return fn().catch(error =>
        maxAttempts > 1
            ? sleep(delay).then(() => retryAsync(fn, maxAttempts - 1, delay))
            : Promise.reject(error)
    );
}

// Add any other utility functions here