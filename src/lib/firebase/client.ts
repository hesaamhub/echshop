import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import { doc, getDocFromServer, getFirestore, type Firestore } from "firebase/firestore"
import firebaseConfig from "../../../firebase-applet-config.json"

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

// CRITICAL: pass firestoreDatabaseId from firebase-applet-config.json
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId)
export const auth: Auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string
  operationType: OperationType
  path: string | null
  authInfo: {
    userId?: string | null
    email?: string | null
    emailVerified?: boolean | null
    isAnonymous?: boolean | null
    tenantId?: string | null
    providerInfo?: {
      providerId?: string | null
      email?: string | null
    }[]
  }
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const currentUser = auth.currentUser
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid ?? null,
      email: currentUser?.email ?? null,
      emailVerified: currentUser?.emailVerified ?? null,
      isAnonymous: currentUser?.isAnonymous ?? null,
      tenantId: currentUser?.tenantId ?? null,
      providerInfo:
        currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) ?? [],
    },
    operationType,
    path,
  }
  console.error("Firestore Error: ", JSON.stringify(errInfo))
  throw new Error(JSON.stringify(errInfo))
}

let connectionTested = false

export async function testConnection(): Promise<boolean> {
  if (connectionTested) return true
  connectionTested = true
  try {
    await getDocFromServer(doc(db, "test", "connection"))
    return true
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.")
      return false
    }
    // Permission or missing test doc still confirms server reachability
    return true
  }
}
