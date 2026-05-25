import { defineConfig } from "vitest/config";

export default defineConfig({
    test : {
        globals : true,
        env : {
            DATABASE_URL : "postgresql://postgres:postgres@localhost:5432/mytask_test?schema=public"   
        }
    }
})