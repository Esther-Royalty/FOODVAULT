import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    testEnvironment: "node",
    transform: {},
    verbose: true,
    testTimeout: 30000,
};
