'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'rn' | 'en' | 'fr'

interface Translations {
    welcome: string
    subtitle: string
    newInterface: string
    recentSearches: string
    noHistory: string
    settings: string
    downloadApp: string
    logout: string
    appLanguage: string
    appearance: string
    light: string
    dark: string
    placeholder: string
    send: string
    dictionary: string
    traduction: string
    verbs: string
    discover: string
    translate: string
    reset: string
    swap: string
    from: string
    to: string
    search: string
    examples: string
    synonyms: string
    tags: string
    allPosts: string
    favorites: string
    results: string
    noResults: string
    definition: string
    copy: string
    share: string
    listen: string
    stop: string
    speaking: string
    conjugaison: string
    copyInfinitive: string
    copyTense: string
    chooseVerb: string
    noVerbsFound: string
    trendingStories: string
    all: string
    fashion: string
    travel: string
    trendingLine: string
    technology: string
    aiTools: string
    business: string
    health: string
    rename: string
    pin: string
    unpin: string
    archive: string
    delete: string
    account: string
    renamePrompt: string
    getApp: string
    scanQR: string
    comingSoon: string
    androidMin: string
    helpSupport: string
    contact: string
    breeding: string
    agriculture: string
    global: string
    commerce: string
    healthChat: string
    translating: string
}

const translations: Record<Language, Translations> = {
    rn: {
        welcome: 'Bwakeye, Amiel',
        subtitle: 'Unataka nini we dogo?',
        newInterface: 'Interfasi nshasha',
        recentSearches: 'Ivyo waheruka kuraba',
        noHistory: 'Nta kahise karihano',
        settings: 'Ugutandukanya',
        downloadApp: 'Shira muri terefone',
        logout: 'Sohoka',
        appLanguage: 'Ururimi rw\'isabukuru',
        appearance: 'Kwinonora',
        light: 'Umuco',
        dark: 'Umwijima',
        placeholder: 'Andike hano...',
        send: 'Rungika',
        dictionary: 'Inkoranyamajambo',
        traduction: 'Insobanuro',
        verbs: 'Amavuga',
        discover: 'Amakuru',
        translate: 'sobanuza',
        reset: 'Subira ntanguriro',
        swap: 'Hingura',
        from: 'Kuva',
        to: 'Kuja',
        search: 'Rondera irivuga...',
        examples: 'Uturorero',
        synonyms: 'Ibisobanuro bindi',
        tags: 'Ibiranga',
        allPosts: 'Vyose',
        favorites: 'Ishimikiro',
        results: 'Ibivuyeyo',
        noResults: 'Ntakivuyeyo',
        definition: 'Insobanuro',
        copy: 'Nukura',
        share: 'Sangira',
        listen: 'Umva',
        stop: 'Hagarika',
        speaking: 'Aravuga',
        conjugaison: 'Ugutondekanya',
        copyInfinitive: 'Kura inyigisho',
        copyTense: 'Kura ino ngera',
        chooseVerb: 'Toranya irivuga',
        noVerbsFound: 'Nta mavuga yabonetse',
        trendingStories: 'Ibigezweho',
        all: 'Vyose',
        fashion: 'Imideri',
        travel: 'Ugutembera',
        trendingLine: 'Kiriko kiravugwa',
        technology: 'Ibuhinga',
        aiTools: 'Ubuhinga bwa AI',
        business: 'Urudandazwa',
        health: 'Amagara',
        rename: 'Hingura izina',
        pin: 'Shira hejuru',
        unpin: 'Kura hejuru',
        archive: 'Bika',
        delete: 'Siba',
        account: 'Ikonte',
        renamePrompt: 'Hingura izina ry\'iki gice:',
        getApp: 'Shira muri terefone Rundi AI',
        scanQR: 'Fyonda ino QR code kugira ushire muri terefone yawe.',
        comingSoon: 'Kiriko kirategurwa',
        androidMin: 'Biboneka kuri Android 8.0 n\'izindi ziri hejuru.',
        helpSupport: 'Ubufasha',
        contact: 'Twandikire',
        breeding: 'Ubworozi',
        agriculture: 'Uburimyi',
        global: 'Rusangi',
        commerce: 'Urudandazwa',
        healthChat: 'Amagara',
        translating: 'Kiriko kirasobanurwa...',
    },
    en: {
        welcome: 'Hi there, Amiel',
        subtitle: 'What do you want today?',
        newInterface: 'New interface',
        recentSearches: 'Recent Searches',
        noHistory: 'No history',
        settings: 'Settings',
        downloadApp: 'Download App',
        logout: 'Logout',
        appLanguage: 'App Language',
        appearance: 'Appearance',
        light: 'Light',
        dark: 'Dark',
        placeholder: 'Type here...',
        send: 'Send',
        dictionary: 'Dictionary',
        traduction: 'Translation',
        verbs: 'Verbs',
        discover: 'Discover',
        translate: 'Translate',
        reset: 'Reset',
        swap: 'Swap',
        from: 'From',
        to: 'To',
        search: 'Search...',
        examples: 'Examples',
        synonyms: 'Synonyms',
        tags: 'Tags',
        allPosts: 'All posts',
        favorites: 'Favorites',
        results: 'results',
        noResults: 'No results',
        definition: 'Definition',
        copy: 'Copy',
        share: 'Share',
        listen: 'Listen',
        stop: 'Stop',
        speaking: 'Speaking',
        conjugaison: 'Conjugation',
        copyInfinitive: 'Copy infinitive',
        copyTense: 'Copy tense',
        chooseVerb: 'Choose a verb',
        noVerbsFound: 'No verbs found',
        trendingStories: 'Trending Stories',
        all: 'All',
        fashion: 'Fashion',
        travel: 'Travel',
        trendingLine: 'Trending',
        technology: 'Technology',
        aiTools: 'AI Tools',
        business: 'Business',
        health: 'Health',
        rename: 'Rename',
        pin: 'Pin',
        unpin: 'Unpin',
        archive: 'Archive',
        delete: 'Delete',
        account: 'Account',
        renamePrompt: 'Rename this history:',
        getApp: 'Get the Rundi AI App',
        scanQR: 'Scan the QR code below to download our mobile application directly to your device.',
        comingSoon: 'Coming Soon',
        androidMin: 'Available for Android 8.0 and above.',
        helpSupport: 'Help & Support',
        contact: 'Contact',
        breeding: 'Breeding',
        agriculture: 'Agriculture',
        global: 'Global',
        commerce: 'Commerce',
        healthChat: 'Health',
        translating: 'Translating...',
    },
    fr: {
        welcome: 'Salut, Amiel',
        subtitle: 'Que voulez-vous aujourd\'hui ?',
        newInterface: 'Nouvelle interface',
        recentSearches: 'Recherches récentes',
        noHistory: 'Pas d\'historique',
        settings: 'Paramètres',
        downloadApp: 'Télécharger l\'application',
        logout: 'Déconnexion',
        appLanguage: 'Langue de l\'application',
        appearance: 'Apparence',
        light: 'Clair',
        dark: 'Sombre',
        placeholder: 'Écrivez ici...',
        send: 'Envoyer',
        dictionary: 'Dictionnaire',
        traduction: 'Traduction',
        verbs: 'Verbes',
        discover: 'Découvrir',
        translate: 'Traduire',
        reset: 'Réinitialiser',
        swap: 'Inverser',
        from: 'De',
        to: 'À',
        search: 'Rechercher...',
        examples: 'Exemples',
        synonyms: 'Synonymes',
        tags: 'Mots-clés',
        allPosts: 'Tous les posts',
        favorites: 'Favoris',
        results: 'résultats',
        noResults: 'Aucun résultat',
        definition: 'Définition',
        copy: 'Copier',
        share: 'Partager',
        listen: 'Écouter',
        stop: 'Arrêter',
        speaking: 'Parle',
        conjugaison: 'Conjugaison',
        copyInfinitive: 'Copier l\'infinitif',
        copyTense: 'Copier ce temps',
        chooseVerb: 'Choisir un verbe',
        noVerbsFound: 'Aucun verbe trouvé',
        trendingStories: 'Histoires tendances',
        all: 'Tout',
        fashion: 'Mode',
        travel: 'Voyage',
        trendingLine: 'Tendance',
        technology: 'Technologie',
        aiTools: 'Outils IA',
        business: 'Affaires',
        health: 'Santé',
        rename: 'Renommer',
        pin: 'Epingler',
        unpin: 'Désépingler',
        archive: 'Archiver',
        delete: 'Supprimer',
        account: 'Compte',
        renamePrompt: 'Renommer cet historique :',
        getApp: 'Obtenez l\'application Rundi AI',
        scanQR: 'Scannez le code QR ci-dessous pour télécharger notre application mobile directement sur votre appareil.',
        comingSoon: 'À venir',
        androidMin: 'Disponible pour Android 8.0 et supérieur.',
        helpSupport: 'Aide et support',
        contact: 'Contact',
        breeding: 'Élevage',
        agriculture: 'Agriculture',
        global: 'Global',
        commerce: 'Commerce',
        healthChat: 'Santé',
        translating: 'Traduction en cours...',
    },
}

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('rn')
    const [hasHydrated, setHasHydrated] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('app-language') as Language
        if (saved && (saved === 'rn' || saved === 'en' || saved === 'fr')) {
            setLanguageState(saved)
        }
        setHasHydrated(true)
    }, [])

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = language
        }
    }, [language])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem('app-language', lang)
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
