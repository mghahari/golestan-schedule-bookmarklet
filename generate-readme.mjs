import { readFileSync, writeFileSync } from "fs"
import { minify } from "terser"

const codeContent = readFileSync("bookmarklet.js", { encoding: "utf-8" })

const minifiedCode = await minify(codeContent, {
    compress: true,
    mangle: true
})

const templateContent = readFileSync("README.template.md", { encoding: "utf-8" })

const finalContent = templateContent.replace("{BOOKMARKLET_CODE}", minifiedCode.code)

writeFileSync("README.md", finalContent)
