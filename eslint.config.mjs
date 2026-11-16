import { FlatCompat } from "@eslint/eslintrc"
import firebaseRulesPlugin from "@firebase/eslint-plugin-security-rules"

const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

const eslintConfig = [
  { ignores: [".next/**", "out/**", "build/**", "node_modules/**", "DRAFT_firestore.rules"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  firebaseRulesPlugin.configs["flat/recommended"],
]

export default eslintConfig
