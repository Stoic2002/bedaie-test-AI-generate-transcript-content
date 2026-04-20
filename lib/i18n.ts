export type Locale = "en" | "id" | "ms";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  ms: "Bahasa Melayu",
};

export const OUTPUT_LANGUAGE_LABELS: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  ms: "Bahasa Melayu (Malaysia)",
};

export const OUTPUT_LANGUAGE_PROMPT: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  ms: "Bahasa Melayu (Malaysian Malay)",
};

type Translations = {
  nav: {
    generate: string;
    history: string;
    settings: string;
    signOut: string;
    collapse: string;
    appName: string;
  };
  generate: {
    title: string;
    subtitle: string;
    templateBtn: string;
    videoTypeLabel: string;
    durationLabel: string;
    topicLabel: string;
    topicPlaceholder: string;
    keywordsLabel: string;
    keywordsPlaceholder: string;
    audienceLabel: string;
    audiencePlaceholder: string;
    toneLabel: string;
    wordLimitLabel: string;
    wordLimitNone: string;
    variationsLabel: string;
    generateBtn: string;
    generatingBtn: string;
    variationTab: string;
    copyBtn: string;
    downloadBtn: string;
    modelInfo: string;
    emptyTitle: string;
    emptySubtitle: string;
    toastApiKey: string;
    toastCopied: string;
    hookLabel: string;
    keyMessageLabel: string;
    ctaLabel: string;
    sceneLabel: string;
    visualLabel: string;
    voiceoverLabel: string;
    onScreenLabel: string;
    transitionLabel: string;
    musicLabel: string;
    noVoiceover: string;
  };
  history: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    noHistory: string;
    noHistorySubtitle: string;
    noResults: string;
    noResultsSubtitle: string;
    scenes: string;
    deleted: string;
    undo: string;
  };
  settings: {
    title: string;
    subtitle: string;
    providerLabel: string;
    providerSubtitle: string;
    modelLabel: string;
    modelSubtitle: string;
    customModelLabel: string;
    customModelPlaceholder: string;
    customModelHint: string;
    apiKeyLabel: string;
    apiKeyPrivacy: string;
    apiKeyGetFrom: string;
    apiKeySaved: string;
    saveBtn: string;
    savedMsg: string;
    languageSection: string;
    languageSectionSubtitle: string;
    uiLanguageLabel: string;
    uiLanguageSubtitle: string;
    outputLanguageLabel: string;
    outputLanguageSubtitle: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    loginBtn: string;
    loginLoading: string;
    noAccount: string;
    createOne: string;
    registerTitle: string;
    registerSubtitle: string;
    registerBtn: string;
    registerLoading: string;
    hasAccount: string;
    signInLink: string;
    nameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    namePlaceholder: string;
  };
};

export const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      generate: "Generate",
      history: "History",
      settings: "Settings",
      signOut: "Sign Out",
      collapse: "Collapse",
      appName: "AI Studio",
    },
    generate: {
      title: "AI Video Script Generator",
      subtitle: "Generate professional video scripts with AI — scene-by-scene breakdowns in seconds.",
      templateBtn: "Templates",
      videoTypeLabel: "Video Type",
      durationLabel: "Duration",
      topicLabel: "Topic",
      topicPlaceholder: "e.g. Launching a new sustainable product for eco-conscious consumers",
      keywordsLabel: "Keywords",
      keywordsPlaceholder: "e.g. eco-friendly, sustainable, green, planet",
      audienceLabel: "Target Audience",
      audiencePlaceholder: "e.g. Young professionals aged 25-35",
      toneLabel: "Tone",
      wordLimitLabel: "Word Limit",
      wordLimitNone: "No limit",
      variationsLabel: "Variations",
      generateBtn: "Generate Script",
      generatingBtn: "Generating...",
      variationTab: "Variation",
      copyBtn: "Copy",
      downloadBtn: "Download .txt",
      modelInfo: "Using",
      emptyTitle: "Your script will appear here",
      emptySubtitle: "Fill the form and click Generate Script to create your AI-powered video script.",
      toastApiKey: "API Key is missing. Please configure it in Settings.",
      toastCopied: "copied to clipboard",
      hookLabel: "Hook",
      keyMessageLabel: "Key Message",
      ctaLabel: "Call to Action",
      sceneLabel: "Scene",
      visualLabel: "Visual",
      voiceoverLabel: "Voiceover",
      onScreenLabel: "On-Screen Text",
      transitionLabel: "Transition",
      musicLabel: "Music",
      noVoiceover: "No voiceover",
    },
    history: {
      title: "History",
      subtitle: "Past generations and exported content.",
      searchPlaceholder: "Search history...",
      noHistory: "No history yet",
      noHistorySubtitle: "Generated scripts will appear here.",
      noResults: "No results found",
      noResultsSubtitle: "We couldn't find anything matching",
      scenes: "Scenes",
      deleted: "Deleted",
      undo: "Undo",
    },
    settings: {
      title: "Settings",
      subtitle: "Configure your AI provider, model, and API key.",
      providerLabel: "AI Provider",
      providerSubtitle: "Choose the AI engine you want to use for generation.",
      modelLabel: "Model",
      modelSubtitle: "Select a model for this provider. Models are listed from recommended to advanced.",
      customModelLabel: "Or enter a custom model ID",
      customModelPlaceholder: "e.g. anthropic/claude-opus-4-7",
      customModelHint: "Browse all models at",
      apiKeyLabel: "API Key",
      apiKeyPrivacy: "Stored purely in your local browser storage. It is never sent to our servers and is only used to securely query the AI provider.",
      apiKeyGetFrom: "Get your key from",
      apiKeySaved: "Key saved locally:",
      saveBtn: "Save Preferences",
      savedMsg: "Saved successfully",
      languageSection: "Language",
      languageSectionSubtitle: "Configure the UI display language and the language used for AI-generated output.",
      uiLanguageLabel: "Interface Language",
      uiLanguageSubtitle: "Changes labels, buttons, and text throughout the app.",
      outputLanguageLabel: "Output Language",
      outputLanguageSubtitle: "The language the AI will use when writing your video scripts.",
    },
    auth: {
      loginTitle: "Welcome back",
      loginSubtitle: "Sign in to continue to AI Studio",
      loginBtn: "Sign in",
      loginLoading: "Signing in...",
      noAccount: "Don't have an account?",
      createOne: "Create one",
      registerTitle: "Create an account",
      registerSubtitle: "Enter your details to get started",
      registerBtn: "Sign up",
      registerLoading: "Creating account...",
      hasAccount: "Already have an account?",
      signInLink: "Sign in",
      nameLabel: "Name",
      emailLabel: "Email",
      passwordLabel: "Password",
      namePlaceholder: "John Doe",
    },
  },

  id: {
    nav: {
      generate: "Buat",
      history: "Riwayat",
      settings: "Pengaturan",
      signOut: "Keluar",
      collapse: "Ciutkan",
      appName: "AI Studio",
    },
    generate: {
      title: "Generator Skrip Video AI",
      subtitle: "Buat skrip video profesional dengan AI — rincian per adegan dalam hitungan detik.",
      templateBtn: "Template",
      videoTypeLabel: "Jenis Video",
      durationLabel: "Durasi",
      topicLabel: "Topik",
      topicPlaceholder: "mis. Peluncuran produk berkelanjutan baru untuk konsumen ramah lingkungan",
      keywordsLabel: "Kata Kunci",
      keywordsPlaceholder: "mis. ramah lingkungan, berkelanjutan, hijau, bumi",
      audienceLabel: "Target Audiens",
      audiencePlaceholder: "mis. Profesional muda usia 25-35 tahun",
      toneLabel: "Nada",
      wordLimitLabel: "Batas Kata",
      wordLimitNone: "Tidak ada batas",
      variationsLabel: "Variasi",
      generateBtn: "Buat Skrip",
      generatingBtn: "Sedang Membuat...",
      variationTab: "Variasi",
      copyBtn: "Salin",
      downloadBtn: "Unduh .txt",
      modelInfo: "Menggunakan",
      emptyTitle: "Skrip Anda akan muncul di sini",
      emptySubtitle: "Isi formulir dan klik Buat Skrip untuk membuat skrip video bertenaga AI Anda.",
      toastApiKey: "API Key belum diatur. Silakan konfigurasikan di Pengaturan.",
      toastCopied: "disalin ke clipboard",
      hookLabel: "Pembuka",
      keyMessageLabel: "Pesan Utama",
      ctaLabel: "Ajakan Bertindak",
      sceneLabel: "Adegan",
      visualLabel: "Visual",
      voiceoverLabel: "Narasi",
      onScreenLabel: "Teks di Layar",
      transitionLabel: "Transisi",
      musicLabel: "Musik",
      noVoiceover: "Tidak ada narasi",
    },
    history: {
      title: "Riwayat",
      subtitle: "Hasil pembuatan dan konten yang telah diekspor.",
      searchPlaceholder: "Cari riwayat...",
      noHistory: "Belum ada riwayat",
      noHistorySubtitle: "Skrip yang dibuat akan muncul di sini.",
      noResults: "Tidak ada hasil ditemukan",
      noResultsSubtitle: "Kami tidak menemukan apapun yang cocok dengan",
      scenes: "Adegan",
      deleted: "Dihapus",
      undo: "Batalkan",
    },
    settings: {
      title: "Pengaturan",
      subtitle: "Konfigurasikan penyedia AI, model, dan API key Anda.",
      providerLabel: "Penyedia AI",
      providerSubtitle: "Pilih mesin AI yang ingin Anda gunakan untuk pembuatan skrip.",
      modelLabel: "Model",
      modelSubtitle: "Pilih model untuk penyedia ini. Model diurutkan dari yang direkomendasikan hingga tingkat lanjut.",
      customModelLabel: "Atau masukkan ID model kustom",
      customModelPlaceholder: "mis. anthropic/claude-opus-4-7",
      customModelHint: "Telusuri semua model di",
      apiKeyLabel: "API Key",
      apiKeyPrivacy: "Disimpan sepenuhnya di penyimpanan browser lokal Anda. Tidak pernah dikirim ke server kami dan hanya digunakan untuk mengakses penyedia AI.",
      apiKeyGetFrom: "Dapatkan kunci Anda dari",
      apiKeySaved: "Kunci tersimpan secara lokal:",
      saveBtn: "Simpan Preferensi",
      savedMsg: "Berhasil disimpan",
      languageSection: "Bahasa",
      languageSectionSubtitle: "Atur bahasa tampilan antarmuka dan bahasa yang digunakan untuk output yang dihasilkan AI.",
      uiLanguageLabel: "Bahasa Antarmuka",
      uiLanguageSubtitle: "Mengubah label, tombol, dan teks di seluruh aplikasi.",
      outputLanguageLabel: "Bahasa Output",
      outputLanguageSubtitle: "Bahasa yang akan digunakan AI saat menulis skrip video Anda.",
    },
    auth: {
      loginTitle: "Selamat datang kembali",
      loginSubtitle: "Masuk untuk melanjutkan ke AI Studio",
      loginBtn: "Masuk",
      loginLoading: "Sedang masuk...",
      noAccount: "Belum punya akun?",
      createOne: "Buat akun baru",
      registerTitle: "Buat akun",
      registerSubtitle: "Masukkan detail Anda untuk memulai",
      registerBtn: "Daftar",
      registerLoading: "Membuat akun...",
      hasAccount: "Sudah punya akun?",
      signInLink: "Masuk",
      nameLabel: "Nama",
      emailLabel: "Email",
      passwordLabel: "Kata Sandi",
      namePlaceholder: "Budi Santoso",
    },
  },

  ms: {
    nav: {
      generate: "Jana",
      history: "Sejarah",
      settings: "Tetapan",
      signOut: "Log Keluar",
      collapse: "Runtuhkan",
      appName: "AI Studio",
    },
    generate: {
      title: "Penjana Skrip Video AI",
      subtitle: "Jana skrip video profesional dengan AI — pecahan adegan demi adegan dalam beberapa saat.",
      templateBtn: "Templat",
      videoTypeLabel: "Jenis Video",
      durationLabel: "Tempoh",
      topicLabel: "Topik",
      topicPlaceholder: "cth. Melancarkan produk baharu yang mampan untuk pengguna mesra alam",
      keywordsLabel: "Kata Kunci",
      keywordsPlaceholder: "cth. mesra alam, mampan, hijau, bumi",
      audienceLabel: "Sasaran Audiens",
      audiencePlaceholder: "cth. Profesional muda berumur 25-35 tahun",
      toneLabel: "Nada",
      wordLimitLabel: "Had Perkataan",
      wordLimitNone: "Tiada had",
      variationsLabel: "Variasi",
      generateBtn: "Jana Skrip",
      generatingBtn: "Sedang Menjana...",
      variationTab: "Variasi",
      copyBtn: "Salin",
      downloadBtn: "Muat Turun .txt",
      modelInfo: "Menggunakan",
      emptyTitle: "Skrip anda akan muncul di sini",
      emptySubtitle: "Isi borang dan klik Jana Skrip untuk menjana skrip video berkuasa AI anda.",
      toastApiKey: "API Key tiada. Sila konfigurasikannya dalam Tetapan.",
      toastCopied: "disalin ke papan klip",
      hookLabel: "Pembukaan",
      keyMessageLabel: "Mesej Utama",
      ctaLabel: "Seruan Bertindak",
      sceneLabel: "Adegan",
      visualLabel: "Visual",
      voiceoverLabel: "Suara Latar",
      onScreenLabel: "Teks di Skrin",
      transitionLabel: "Peralihan",
      musicLabel: "Muzik",
      noVoiceover: "Tiada suara latar",
    },
    history: {
      title: "Sejarah",
      subtitle: "Penjanaan lepas dan kandungan yang telah dieksport.",
      searchPlaceholder: "Cari sejarah...",
      noHistory: "Tiada sejarah lagi",
      noHistorySubtitle: "Skrip yang dijana akan muncul di sini.",
      noResults: "Tiada keputusan dijumpai",
      noResultsSubtitle: "Kami tidak dapat menemui sebarang perkara yang sepadan dengan",
      scenes: "Adegan",
      deleted: "Dipadam",
      undo: "Buat Asal",
    },
    settings: {
      title: "Tetapan",
      subtitle: "Konfigurasikan pembekal AI, model, dan API key anda.",
      providerLabel: "Pembekal AI",
      providerSubtitle: "Pilih enjin AI yang anda ingin gunakan untuk penjanaan skrip.",
      modelLabel: "Model",
      modelSubtitle: "Pilih model untuk pembekal ini. Model disenaraikan dari yang disyorkan hingga peringkat lanjut.",
      customModelLabel: "Atau masukkan ID model tersuai",
      customModelPlaceholder: "cth. anthropic/claude-opus-4-7",
      customModelHint: "Semak imbas semua model di",
      apiKeyLabel: "API Key",
      apiKeyPrivacy: "Disimpan sepenuhnya dalam storan pelayar tempatan anda. Ia tidak pernah dihantar ke pelayan kami dan hanya digunakan untuk mengakses pembekal AI.",
      apiKeyGetFrom: "Dapatkan kunci anda dari",
      apiKeySaved: "Kunci disimpan secara tempatan:",
      saveBtn: "Simpan Keutamaan",
      savedMsg: "Berjaya disimpan",
      languageSection: "Bahasa",
      languageSectionSubtitle: "Konfigurasikan bahasa paparan antara muka dan bahasa yang digunakan untuk output yang dijana AI.",
      uiLanguageLabel: "Bahasa Antara Muka",
      uiLanguageSubtitle: "Menukar label, butang, dan teks di seluruh aplikasi.",
      outputLanguageLabel: "Bahasa Output",
      outputLanguageSubtitle: "Bahasa yang akan digunakan AI semasa menulis skrip video anda.",
    },
    auth: {
      loginTitle: "Selamat kembali",
      loginSubtitle: "Log masuk untuk meneruskan ke AI Studio",
      loginBtn: "Log Masuk",
      loginLoading: "Sedang log masuk...",
      noAccount: "Tiada akaun?",
      createOne: "Cipta sekarang",
      registerTitle: "Cipta akaun",
      registerSubtitle: "Masukkan maklumat anda untuk bermula",
      registerBtn: "Daftar",
      registerLoading: "Mencipta akaun...",
      hasAccount: "Sudah ada akaun?",
      signInLink: "Log Masuk",
      nameLabel: "Nama",
      emailLabel: "E-mel",
      passwordLabel: "Kata Laluan",
      namePlaceholder: "Ahmad Rahman",
    },
  },
};

export function getTranslations(locale: Locale) {
  return translations[locale] ?? translations.en;
}
