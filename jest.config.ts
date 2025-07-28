// jest.config.ts
import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^.+\\.(css|scss|sass)$": "identity-obj-proxy",
    },
    transformIgnorePatterns: ["/node_modules/"],
};

export default createJestConfig(customJestConfig);
