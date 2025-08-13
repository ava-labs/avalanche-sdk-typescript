import crypto from 'crypto';
import { canonicalize } from 'json-canonicalize';

export function validateSignature(signingSecret: any, signature: any, payload: any) {
    const canonicalizedPayload = canonicalize(payload);
    const hmac = crypto.createHmac('sha256', Buffer.from(signingSecret, 'hex'));
    const digest = hmac.update(canonicalizedPayload).digest('base64');
    console.log("signature: ", signature);
    console.log("digest", digest);
    return signature === digest;
}