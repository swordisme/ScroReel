export type Language = 'en' | 'ar' | 'fr' | 'es'

export interface TranslationDict {
  home: string
  shows: string
  movies: string
  newAndPopular: string
  myList: string
  browseByLanguages: string
  genres: string
  allGenres: string
  search: string
  searchPlaceholder: string
  signIn: string
  logout: string
  adminStudio: string
  allAccess: string
  coins: string
  watchFree: string
  watchNow: string
  moreInfo: string
  featured: string
  episodes: string
  free: string
  locked: string
  unlockEpisode: string
  unlockNow: string
  trendingNow: string
  top10: string
  popularThisWeek: string
  exploreLibrary: string
  selectLanguage: string
  originalLanguage: string
  dubbedIn: string
  noContentFound: string
  backToSeries: string
  seasonFinale: string
  unlockForCoins: string
  allAccessWeekly: string
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {
    home: 'Home',
    shows: 'TV Shows',
    movies: 'Movies',
    newAndPopular: 'New & Popular',
    myList: 'My List',
    browseByLanguages: 'Browse by Languages',
    genres: 'Genres',
    allGenres: 'All Genres',
    search: 'Search',
    searchPlaceholder: 'Search titles, genres, actors...',
    signIn: 'Sign In',
    logout: 'Logout',
    adminStudio: 'Admin Studio',
    allAccess: 'All-Access Pass',
    coins: 'Coins',
    watchFree: 'Watch Free',
    watchNow: 'Watch Now',
    moreInfo: 'More Info',
    featured: 'Featured',
    episodes: 'Episodes',
    free: 'Free',
    locked: 'Locked',
    unlockEpisode: 'Unlock Episode',
    unlockNow: 'Unlock Now',
    trendingNow: 'Trending Now',
    top10: 'Top 10 Today',
    popularThisWeek: 'Popular This Week',
    exploreLibrary: 'Explore Library',
    selectLanguage: 'Select Language',
    originalLanguage: 'Original Language',
    dubbedIn: 'Dubbed / Subtitled In',
    noContentFound: 'No content found.',
    backToSeries: 'Back to Series',
    seasonFinale: 'Season Finale',
    unlockForCoins: 'Unlock for 10 Coins',
    allAccessWeekly: 'All-Access Pass - $9.99/week',
  },
  ar: {
    home: 'الرئيسية',
    shows: 'مسلسلات',
    movies: 'أفلام',
    newAndPopular: 'جديد ورائج',
    myList: 'قائمتي',
    browseByLanguages: 'تصفح حسب اللغة',
    genres: 'التصنيفات',
    allGenres: 'جميع التصنيفات',
    search: 'بحث',
    searchPlaceholder: 'ابحث عن المسلسلات، التصنيفات، الممثلين...',
    signIn: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    adminStudio: 'استوديو الإدارة',
    allAccess: 'اشتراك شامل',
    coins: 'العملات',
    watchFree: 'شاهد مجاناً',
    watchNow: 'شاهد الآن',
    moreInfo: 'تفاصيل أكثر',
    featured: 'مميز',
    episodes: 'حلقات',
    free: 'مجاني',
    locked: 'مغلق',
    unlockEpisode: 'فتح الحلقة',
    unlockNow: 'افتح الآن',
    trendingNow: 'الأكثر رواجاً اليوم',
    top10: 'أفضل 10 أعمال',
    popularThisWeek: 'شائع هذا الأسبوع',
    exploreLibrary: 'استكشف المكتبة',
    selectLanguage: 'اختر اللغة',
    originalLanguage: 'اللغة الأصلية',
    dubbedIn: 'مترجم / مدبلج إلى',
    noContentFound: 'لم يتم العثور على محتوى.',
    backToSeries: 'العودة للمسلسل',
    seasonFinale: 'خاتمة الموسم',
    unlockForCoins: 'فتح بـ 10 عملات',
    allAccessWeekly: 'اشتراك شامل - 9.99$ / أسبوع',
  },
  fr: {
    home: 'Accueil',
    shows: 'Séries',
    movies: 'Films',
    newAndPopular: 'Nouveautés & Populaires',
    myList: 'Ma Liste',
    browseByLanguages: 'Parcourir par langue',
    genres: 'Genres',
    allGenres: 'Tous les genres',
    search: 'Rechercher',
    searchPlaceholder: 'Rechercher des titres, genres, acteurs...',
    signIn: 'Se connecter',
    logout: 'Déconnexion',
    adminStudio: 'Studio Admin',
    allAccess: 'Pass Illimité',
    coins: 'Pièces',
    watchFree: 'Regarder Gratuitement',
    watchNow: 'Regarder',
    moreInfo: 'Plus d’infos',
    featured: 'En vedette',
    episodes: 'Épisodes',
    free: 'Gratuit',
    locked: 'Verrouillé',
    unlockEpisode: 'Débloquer l’épisode',
    unlockNow: 'Débloquer maintenant',
    trendingNow: 'Tendances actuelles',
    top10: 'Top 10 aujourd’hui',
    popularThisWeek: 'Populaire cette semaine',
    exploreLibrary: 'Explorer le catalogue',
    selectLanguage: 'Choisir la langue',
    originalLanguage: 'Langue originale',
    dubbedIn: 'Doublé / Sous-titré en',
    noContentFound: 'Aucun contenu trouvé.',
    backToSeries: 'Retour à la série',
    seasonFinale: 'Final de la saison',
    unlockForCoins: 'Débloquer pour 10 Pièces',
    allAccessWeekly: 'Pass Illimité - 9,99$/semaine',
  },
  es: {
    home: 'Inicio',
    shows: 'Series',
    movies: 'Películas',
    newAndPopular: 'Novedades y Populares',
    myList: 'Mi Lista',
    browseByLanguages: 'Explorar por idioma',
    genres: 'Géneros',
    allGenres: 'Todos los géneros',
    search: 'Buscar',
    searchPlaceholder: 'Buscar títulos, géneros, actores...',
    signIn: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    adminStudio: 'Estudio de Admin',
    allAccess: 'Pase Total',
    coins: 'Monedas',
    watchFree: 'Ver Gratis',
    watchNow: 'Ver Ahora',
    moreInfo: 'Más Información',
    featured: 'Destacado',
    episodes: 'Episodios',
    free: 'Gratis',
    locked: 'Bloqueado',
    unlockEpisode: 'Desbloquear Episodio',
    unlockNow: 'Desbloquear Ahora',
    trendingNow: 'Tendencias',
    top10: 'Top 10 Hoy',
    popularThisWeek: 'Popular Esta Semana',
    exploreLibrary: 'Explorar Catálogo',
    selectLanguage: 'Seleccionar idioma',
    originalLanguage: 'Idioma original',
    dubbedIn: 'Doblado / Subtitulado en',
    noContentFound: 'No se encontró contenido.',
    backToSeries: 'Volver a la serie',
    seasonFinale: 'Final de temporada',
    unlockForCoins: 'Desbloquear por 10 Monedas',
    allAccessWeekly: 'Pase Total - $9.99/semana',
  },
}

export const LANGUAGE_OPTIONS: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]
