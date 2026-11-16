"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth"
import { auth, googleProvider, testConnection } from "@/lib/firebase/client"
import {
  checkIsAdmin,
  ensureUserProfile,
  type UserPrivateProfile,
  type UserPublicProfile,
} from "@/lib/firebase/repository"

type FirebaseContextValue = {
  user: User | null
  authReady: boolean
  isAdmin: boolean
  dbConnected: boolean
  publicProfile: UserPublicProfile | null
  privateProfile: UserPrivateProfile | null
  signInWithGoogle: () => Promise<User | null>
  signOutUser: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null)

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [dbConnected, setDbConnected] = useState(true)
  const [publicProfile, setPublicProfile] = useState<UserPublicProfile | null>(null)
  const [privateProfile, setPrivateProfile] = useState<UserPrivateProfile | null>(null)
  const syncTasksRef = useRef<Map<string, Promise<void>>>(new Map())

  const syncUser = useCallback(async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      setIsAdmin(false)
      setPublicProfile(null)
      setPrivateProfile(null)
      return
    }

    const activeTask = syncTasksRef.current.get(firebaseUser.uid)
    if (activeTask) {
      await activeTask
      return
    }

    const task = (async () => {
      try {
        const [adminFlag, profile] = await Promise.all([
          checkIsAdmin(firebaseUser),
          ensureUserProfile(firebaseUser),
        ])
        setIsAdmin(adminFlag)
        setPublicProfile(profile.publicProfile)
        setPrivateProfile(profile.privateProfile)
      } catch (error) {
        console.error("Failed to sync Firebase user profile:", error)
      } finally {
        syncTasksRef.current.delete(firebaseUser.uid)
      }
    })()

    syncTasksRef.current.set(firebaseUser.uid, task)
    await task
  }, [])

  useEffect(() => {
    void testConnection().then((ok) => setDbConnected(ok))

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setAuthReady(true)
      void syncUser(firebaseUser)
    })

    return () => unsubscribe()
  }, [syncUser])

  const signInWithGoogle = useCallback(async () => {
    const credential = await signInWithPopup(auth, googleProvider)
    await syncUser(credential.user)
    return credential.user
  }, [syncUser])

  const signOutUser = useCallback(async () => {
    await signOut(auth)
    setUser(null)
    setIsAdmin(false)
    setPublicProfile(null)
    setPrivateProfile(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (auth.currentUser) {
      await syncUser(auth.currentUser)
    }
  }, [syncUser])

  return (
    <FirebaseContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        dbConnected,
        publicProfile,
        privateProfile,
        signInWithGoogle,
        signOutUser,
        refreshProfile,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

export function useFirebase() {
  const ctx = useContext(FirebaseContext)
  if (!ctx) {
    throw new Error("useFirebase must be used inside FirebaseProvider")
  }
  return ctx
}
