export default {
  addComment: {
    placeholderTitle: "コメントを入力してください...",
    submitting: "送信中...",
    submit: "コメントを投稿"
  },
  commentSection: {
    loadingComments: "コメントを読み込み中...",
    noComments: "まだコメントはありません。最初のコメントを投稿しよう！",
    deleting: "削除中...",
    noPermissionDelete: "このコメントを削除する権限がありません",
    commentNotFound: "コメントが存在しないか、削除された可能性があります",
    deleteFail: "削除に失敗しました。後で再試行してください",
    justNow: "たった今",
    minutesAgo: "分前",
    hoursAgo: "時間前",
    deleteConfirm: "このコメントを削除してもよろしいですか？"
  },
  dailyPlan: {
    arrival: "到着",
    change: "変更",
    cancel: "キャンセル",
    remove: "削除",
    noPlaces: "まだスポットは追加されていません",
    selectTripMessage: "右側のサイドバーから旅行と日付を選択して、日々の計画を確認してください。",
    sortFail: "並べ替えの更新に失敗しました"
  },
  itinerary: {
    loadItineraryFail: "旅行の読み込みに失敗しました",
    timeConflict: "他のスポットと時間が重複しています！",
    updateTimeFail: "時間の更新に失敗しました",
    updateOrderFail: "並べ替えの更新に失敗しました",
    selectLocationDate: "場所と日付を選択してください",
    placeAlreadyAdded: "このスポットはすでに追加されています",
    addPlaceFail: "追加に失敗しました",
    removePlaceFail: "削除に失敗しました"
  },
  navbar: {
    explore: "探索",
    community: "コミュニティ",
    profilePicture: "プロフィール画像"
  },
  paymentModal: {
    success: "支払い成功",
    successMessage: "ご購入ありがとうございます！ 支払いは正常に処理されました。",
    close: "閉じる",
    fail: "支払い失敗",
    failMessage: "申し訳ありませんが、支払いは成功しませんでした。後で再試行するか、カスタマーサービスにお問い合わせください。",
    upgradeToPremium: "プレミアム会員にアップグレード",
    payAmount: "支払い金額は",
    moreTrips: "円で、さらに多くの旅行を作成できます！",
    linePayLoading: "LINE Payの支払いリンクを生成中です。しばらくお待ちください...",
    goToLinePay: "LINE Payで支払う",
    useCreditCard: "クレジットカードで支払う",
    creditCardPayment: "クレジットカード支払い",
    testCardNumber: "（テストカード番号：4111 1111 1111 1111）",
    loading: "読み込み中...",
    initCreditCardPayment: "クレジットカード支払いの初期化",
    confirmCreditCardPayment: "クレジットカード支払いの確認",
    alreadyPremium: "すでにプレミアム会員です！ご支援ありがとうございます。"
  },
  postCard: {
    author: "投稿者"
  },
  postForm: {
    selectSchedule: "旅行を選択",
    mainImage: "投稿のメイン画像",
    content: "投稿内容",
    submitPost: "投稿する",
    fetchError: "取得できませんでした",
    fileError: "形式がサポートされていないか、ファイルが大きすぎます。JPG、PNG、WebP形式のファイルをアップロードしてください。最大ファイルサイズは3MBです",
    submitError: "投稿に失敗しました。後で再試行してください！",
    success: "成功"
  },
  postPopup: {
    travelReference: "旅行の参照",
    anonymousUser: "匿名ユーザー",
    scheduleDeleted: "旅行は削除されました",
    noContent: "内容なし",
    justNow: "たった今",
    minutesAgo: "分前",
    hoursAgo: "時間前"
  },
  shareTripModal: {
    inviteCollaborators: "共編者を招待",
    editPermission: "編集可能",
    viewPermission: "表示専用",
    scanQr: "携帯電話でQRコードをスキャンして、旅行を表示する",
    copyLink: "リンクをコピー",
    collaborators: "共編者",
    linkCopied: "リンクがコピーされました！",
    copyFailed: "コピーに失敗しました",
    generateLinkFailed: "リンクの生成に失敗しました。",
    permissionChangeFailed: "権限の変更に失敗しました",
    removeFailed: "削除に失敗しました",
    confirmRemove: "{name} を削除してもよろしいですか？",
    unknownUser: "不明なユーザー",
    linkUpdated: "招待リンクが更新されました",
    fetchMembersFailed: "共編者の取得に失敗しました"
  },
  traffic: {
    selectMode: "交通手段を選択",
    drive: "車で",
    walk: "歩き",
    transit: "公共交通機関",
    errorFetchingData: "交通情報の取得に失敗しました。後で再試行してください"
  },
  schedule: {
    placeholderTitle: "旅行に名前を付けてください⸜(*ˊᗜˋ*)⸝",
    setup: "旅行設定",
    uploadImage: "画像をアップロード",
    crop: "切り抜き",
    cancel: "キャンセル",
    saving: "保存中...",
    create: "作成",
    errorFields: "旅行名と開始/終了日を入力してください",
    successSave: "保存に成功しました。フォームを閉じて旅行を編集できます",
    errorSave: "保存に失敗しました。後で再試行してください",
    title: "旅行名",
    dates: "旅行日程",
    totalDays: "合計 {{ days }} 日",
    description: "旅行説明（任意）",
    unsavedChanges: "保存していない内容があります。離れますか？",
    placeholderDescription: "簡単に自分の旅行を記録してください～(ﾉ˶>ᗜ​<˵)ﾉ"
  },
  tripList: {
    myTrips: "私の旅行",
    noTrips: "まだ旅行データがありません！",
    noCoverImage: "カバー画像なし",
    total: "合計",
    days: "日"
  },
  tripOverview: {
    backToOverview: "旅行概要に戻る",
    noCoverImage: "カバー画像なし",
    changeCover: "カバー変更",
    saved: "保存済み",
    cancel: "キャンセル",
    crop: "切り抜き",
    notes: "メモ：",
    placeholderNotes: "ここをクリックして旅行メモを追加または編集..."
  },
  communityList: {
    noPosts: "まだ投稿はありません。最初の投稿を作成しましょう！",
    allPostsLoaded: "すべての投稿が読み込まれました",
    errorFetchingPosts: "投稿の読み込みに失敗しました"
  },
  emailSettings: {
    title: "メール通知設定",
    loading: "読み込み中...",
    save: "設定を保存",
    notLoggedInError: "ログインしていないため、設定を読み込めません。",
    errorFetchingPreferences: "設定の読み込みに失敗しました。",
    notLoggedInSaveError: "ログインしていないため、設定を保存できません。",
    preferencesUpdated: "設定が更新されました！",
    saveError: "保存に失敗しました。後で再試行してください。",
    onLogin: "ログイン成功",
    onLoginfail: "アカウントログインに異常があります",
    onComment: "投稿にコメントが追加されました",
    onBookmark: "投稿がブックマークされました"
  }
};
