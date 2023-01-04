/** Returns a random unique nonce */
export function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        const random = Math.floor(Math.random() * possible.length);
        text += possible.charAt(random);
    }
    return text;
}
