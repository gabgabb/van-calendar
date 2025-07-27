import type { Config } from "jest";
import "@testing-library/jest-dom";

const config: Config = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};

export default config;
