export default {
  global: {
    welcome: "歡迎使用 Tripfolio",
    current: "當前",
    searchPlaceholder: "輸入地點",
    searchButton: "搜尋",
    loadMore: "載入更多",
    userNameFallback: "使用者",
  },
  navbar: {
    explore: "探索",
    community: "社群",
    profileEdit: "會員資料修改",
    login: "登入",
    signup: "註冊",
  },
  homepage: {
    emailNotice: "Email 通知",
    connectCalendar: "連結 Google Calendar",
    schedule: "個人行程",
    communityTab: "社群貼文",
    profileEdit: "會員資料修改",
  },
  community: {
    noPosts: "尚無貼文，快來建立第一篇吧！",
    allLoaded: "已載入所有貼文",
    loadPostsError: "載入貼文失敗",
    goToCreatePost: "新增貼文",
  },
  emailNotify: {
    title: "Email 通知設定",
    loading: "載入中...",
    save: "儲存設定",
    onLogin: "登入成功",
    onLoginfail: "帳號登入異常",
    onComment: "貼文被留言",
    onBookmark: "貼文被收藏",
    notLoggedInLoad: "尚未登入，無法載入偏好設定。",
    loadFailed: "載入偏好設定失敗。",
    notLoggedInSave: "尚未登入，無法儲存設定。",
    success: "偏好設定已更新！",
    saveFailed: "儲存失敗，請稍後再試。",
  },
  errors: {
    unauthorized: "尚未授權存取",
    network: "網路錯誤，請稍後再試。",
    unknown: "發生錯誤，請稍後再試。",
  },
  tripInvite: {
    loading: "載入中...",
    invalidLink: "此連結已過期或無效",
    loadError: "無法載入行程資訊",
    ownerLabel: "主揪",
    editorPermission: "編輯權限",
    viewerPermission: "檢視權限",
    alreadyJoined: "你已是共編成員！",
    joinButton: "加入共編",
    joinFailed: "加入失敗，請稍後再試"
  },
  googleCalendar: {
    loading: "處理中...",
    loginButton: "登入 Google 並建立行程",
    openCalendar: "開啟 Google Calendar",
    copyLink: "複製連結",
    missingEnv: "缺少 CLIENT_ID 或 API_KEY，請檢查環境變數",
    initFailed: "Google API 初始化失敗：{error}",
    apiNotReady: "Google API 尚未初始化完成，請稍後再試",
    authFailed: "認證失敗：{error}",
    authSuccess: "認證成功！建立行程中...",
    testEventTitle: "測試行程",
    createSuccess: "成功建立行程：",
    createError: "建立行程錯誤：{error}",
    copySuccess: "連結已複製！",
    copyFailed: "複製失敗：{error}"
  },
  googleMap: {
    current: "當前",
    searchPlaceholder: "輸入地點",
    searchButton: "搜尋",
    loadMore: "載入更多",
    addToItinerary: "加入行程+",
    prevImage: "上一張圖片",
    nextImage: "下一張圖片",
    selectPlaceDate: "請選擇地點與日期",
    addSuccess: "成功加入行程！",
    getLocationFailed: "無法取得你的定位！",
    notFound: "找不到地點！",
    routeFailed: "路線規劃失敗：{status}",
    mapNotReady: "地圖尚未初始化完成，請稍後再試。",
    notSupported: "你的瀏覽器不支援地理定位功能。",
    getLocationError: "無法取得你的定位資訊：",
    getDetailError: "取得詳細資料失敗：",
    loadFailed: "Google Maps 載入失敗",
    reviewCount: "（共 {count} 則評價）",
    yourLocation: "你的位置",
    nonPlaceClicked: "點擊了非地點的區域",
  },
  linePay: {
    failTitle: "付款失敗",
    failDescription: "抱歉，您的付款未成功。請稍後再試或聯絡客服。",
    failBackButton: "返回付款頁面",
    successTitle: "付款成功",
    successDescription: "感謝您的購買！您的付款已成功處理。",
    successBackButton: "回到行程編輯",
  },
  login: {
    title: "登入頁面",
    emailPlaceholder: "請輸入電子郵件",
    passwordPlaceholder: "請輸入密碼",
    errorEmpty: "請輸入 Email 和密碼",
    errorFailed: "登入失敗，請檢查郵件與密碼",
    buttonLogin: "登入",
    buttonRegister: "我要註冊",
    buttonLogout: "登出",
    loggedIn: "您已登入",
  },
  memberProfile: {
    title: '資料修改',
    avatar: {
      change: '更換大頭貼',
      save: '儲存大頭貼'
    },
    form: {
      name: '名稱',
      namePlaceholder: '請輸入名稱',
      gender: '性別',
      male: '男',
      female: '女',
      phone: '手機號碼',
      phonePlaceholder: '請輸入手機號碼',
      phoneError: '手機格式錯誤，範例：0912345678',
      birthday: '生日',
      save: '儲存會員資料'
    },
    password: {
      title: '密碼修改',
      old: '舊密碼',
      new: '新密碼',
      confirm: '再次輸入新密碼',
      submit: '送出修改密碼',
      hint: '需輸入8位以上字元，密碼需包含數字+英文',
      minLength: '密碼至少需8個字元',
      mustContainLetter: '密碼需包含英文字母',
      mustContainNumber: '密碼需包含數字',
      cannotBeSameAsName: '密碼不可與姓名相同'
    }
  },
  scheduleDetail: {
    dayLabel: '第{index}天',
    loadFailed: '無法載入行程',
    coverUpdateSuccess: '封面已成功更新！',
    coverUpdateFailed: '封面更新失敗',
    titleUpdateFailed: '標題更新失敗',
    dateUpdateFailed: '更新日期失敗',
    notesUpdateFailed: '筆記更新失敗'
  },
  payment: {
    title: '升級為付費會員',
    description: '僅需支付 NT${amount} 元，即可建立更多行程！',
    isPremiumNotice: '您已經是付費會員！感謝您的支持。',
    linePayLoading: 'LINE Pay 付款連結生成中，請稍候...',
    linePayButton: '前往 LINE Pay 付款',
    creditCardButton: '使用信用卡付款',
    creditCardTitle: '信用卡付款',
    testCardHint: '（測試用卡號： 4111 1111 1111 1111 ）',
    loading: '載入中...',
    initCreditCard: '初始化信用卡付款',
    confirmCreditCard: '確認信用卡付款',
    error: {
      checkStatusFail: '檢查會員狀態失敗'
    },
    alert: {
      loginRequired: '請先登入才能進行付款。',
      linePayLinkFail: '無法獲取 Line Pay 付款連結，請稍後再試。',
      linePayInitFail: 'LINE Pay 付款初始化失敗，請檢查網路連線或稍後再試。',
      clientTokenFail: '無法獲取信用卡付款 Client Token，請檢查網路連線或稍後再試。',
      creditCardLoadFail: '信用卡付款介面載入失敗，請稍後再試。',
      creditCardNotReady: '信用卡付款介面未準備好。',
      paymentSuccess: '付款成功！金額：NT${amount}\n交易編號：${txnId}',
      paymentFail: '付款失敗：${message}',
      creditCardFail: '信用卡付款失敗，請稍後再試。',
      unknownError: '未知錯誤'
    }
  },
  signUp: {
    title: '註冊頁面',
    form: {
      namePlaceholder: '該怎麼稱呼您',
      emailPlaceholder: '請輸入電子郵件',
      passwordPlaceholder: '請輸入密碼',
      submit: '註冊',
      toLogin: '有會員走這裡'
    },
    error: {
      generalFail: '註冊失敗，請稍後重試'
    }
  },
  travel: {
    createTrip: '建立行程',
    deleteTrip: '刪除行程',
    noTrips: '尚未建立任何行程',
    upgradeTitle: '升級成付費會員',
    upgradeDescription: '免費會員僅可建立一筆行程，若要建立更多行程，請升級為付費會員。',
    goToPayment: '前往付款',
    cancel: '取消',
    alert: {
      loginRequired: '請先登入會員',
      confirmDelete: '確定刪除這個行程嗎？',
      deleteSuccess: '刪除成功',
      deleteFail: '刪除失敗，請稍後再試'
  }
  },
  common: {
    reviews: '則評價',
  },
  addComment: {
    placeholder: '寫下你的留言...',
    sending: '送出中...',
    submit: '發表留言'
  },
  commentSection: {
    loading: '載入留言中...',
    noComments: '還沒有留言，成為第一個留言的人吧！',
    anonymous: '匿名使用者',
    deleting: '刪除中...'
  },
  dailyPlan: {
    arrive: '抵達',
    confirm: '更改',
    cancel: '取消',
    remove: '刪除',
    noPlaces: '尚未加入任何景點',
    selectTrip: '請從右側邊欄選擇一個旅程和日期來查看每日計畫。',
    sortFail: '排序更新失敗'
  },
  itinerary: {
    loadFail: '載入行程失敗',
    conflict: '有其他景點時間重複！',
    updateTimeFail: '更新時間失敗',
    sortFail: '排序更新失敗',
    selectPlaceDate: '請選擇地點與日期',
    alreadyAdded: '已加入此景點',
    addFail: '加入失敗',
    addPlaceFail: '加入景點失敗',
    deleteFail: '刪除失敗'
  },
  navbar: {
    explore: '探索',
    community: '社群'
  },
  postCard: {
    author: '發文者'
  },
  postForm: {
    selectSchedule: '選擇行程',
    cover: '貼文主圖',
    content: '貼文內容',
    submit: '送出貼文',
    fetchFail: '無法取得',
    invalidFile: '格式不支援或檔案太大。請上傳 JPG、PNG 或 WebP。檔案最高3MB',
    success: '發佈成功',
    submitFail: '發佈貼文失敗，請稍後再試！'
  },
  postPopup: {
    anonymous: '匿名使用者',
    scheduleDeleted: '行程已刪除',
    noContent: '沒有內容',
    scheduleReference: '行程參考'
  },
  shareTrip: {
    invite: '邀請共編',
    editor: '可編輯',
    viewer: '僅供檢視',
    qrHint: '手機掃描條碼，即可查看此行程',
    copyLink: '複製連結',
    members: '共編成員',
    alertLinkUpdated: '邀請連結已更新',
    alertLinkFail: '產生連結失敗。',
    alertCopied: '已複製連結！',
    alertCopyFail: '複製失敗',
    alertFetchMembersFail: '取得共編成員失敗。',
    alertChangeFail: '變更權限失敗',
    alertConfirmRemove: '確定要移除 {name} 嗎？',
    alertRemoveFail: '移除失敗'
  },
  traffic: {
    selectTransport: '— 選交通方式 —',
    driving: '🚗 開車',
    walking: '🚶‍♂️ 步行',
    transit: '🚇 大眾運輸',
    alertFail: '讀取交通資訊失敗，請稍後再試'
  },
  travelSchedule: {
    title: '行程設定',
    uploadImage: '上傳圖片',
    cancel: '取消',
    crop: '裁切',
    name: '行程名稱',
    namePlaceholder: '幫行程取個名字⸜(*ˊᗜˋ*)⸝',
    date: '行程日期',
    totalDays: '共 {days} 天',
    descLabel: '行程描述(可選填)',
    descPlaceholder: '請簡單記錄一下自己的行程吧~(ﾉ˶>ᗜ​<˵)ﾉ',
    saving: '儲存中...',
    create: '建立',
    alertFill: '請填寫行程名稱及行程開始/結束日期',
    alertSuccess: '儲存成功，你可以關閉表單點擊行程進入編輯',
    alertFail: '儲存失敗，請稍後再試',
    confirmExit: '您有尚未儲存的內容，確定要離開嗎?',
  },
  tripList: {
    title: '我的行程',
    noData: '還沒有任何行程資料！',
    noCover: '無封面圖片',
    totalDays: '共 {days} 天',
  },
  tripOverview: {
    back: '返回行程總覽',
    noCover: '無封面圖片',
    changeCover: '更改封面',
    saved: '已儲存',
    totalDays: '(共 {days} 天)',
    notes: '筆記：',
    notesPlaceholder: '點擊這裡新增或編輯行程筆記...'
  }
};
