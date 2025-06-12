<template>
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <button
            @click="handleAuthClick"
            class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            :disabled="loading"
        >
            {{ loading ? '處理中...' : '登入 Google 並建立行程' }}
        </button>

        <div
            v-if="message"
            class="mt-4 p-3 rounded border"
            :class="message.includes('成功') ? 'border-green-500 bg-green-100 text-green-700' : 'border-red-500 bg-red-100 text-red-700'"
        >
            <!-- 成功綠底，錯誤紅底 -->
            <p>{{ message }}</p>

            <div v-if="isLink" class="mt-2 space-x-2">
                <a :href="eventLink" target="_blank" rel="noopener noreferrer">
                    <button
                    class="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition"
                    >
                    開啟 Google Calendar
                    </button>
                </a>
                <button @click="copyLink"
                class="bg-gray-300 text-gray-800 py-1 px-2 rounded hover:bg-gray-400 transition"
                >
                📋 複製連結
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const message = ref('')
const eventLink = ref('')
const loading = ref(false) //避免使用者連點按鈕（避免重複請求）
const isLink = ref(false)

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
const SCOPES = 'https://www.googleapis.com/auth/calendar.events'

let gapi = null
let tokenClient = null //access token
let gapiInitialized = false //判斷 gapi client 是否已完成初始化

onMounted(() => {
    // 載入 gapi
    const gapiScript = document.createElement('script')
    gapiScript.src = 'https://apis.google.com/js/api.js'
    gapiScript.onload = () => {
        gapi = window.gapi
        gapi.load('client', initializeGapiClient)
    }
    document.body.appendChild(gapiScript)

    // 載入 Google Identity Services (GIS) 的 script
    const gisScript = document.createElement('script')
    gisScript.src = 'https://accounts.google.com/gsi/client'
    document.body.appendChild(gisScript)
})

//登入初始化
function initializeGapiClient() {
    if (!CLIENT_ID || !API_KEY) {
        console.error('缺少 CLIENT_ID 或 API_KEY')
        message.value = '缺少 CLIENT_ID 或 API_KEY，請檢查環境變數'
        return
    }

    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    }).then(() => {
        console.log('GAPI client initialized')
        gapiInitialized = true
    }).catch(err => {
        console.error('GAPI 初始化失敗', err)
        message.value = 'Google API 初始化失敗：' + err.message
    })
}

function handleAuthClick() {
    if (!gapiInitialized) {
        alert('Google API 尚未初始化完成，請稍後再試')
        return
    }

    if (!tokenClient) {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (resp) => {
                if (resp.error) {
                    message.value = '認證失敗：' + resp.error
                    console.error('OAuth 認證錯誤', resp)
                    return
                }
                message.value = '認證成功！建立行程中...'
                createTestEvent()
            }
        })
    }

    tokenClient.requestAccessToken()
}

/**
 * [開發測試用] 建立一筆固定時間與標題的 Google Calendar 行程
 * 可用於本地測試授權與 API 是否正常運作
 * ❗不要在正式頁面中自動執行
 */
function createTestEvent() {
    const startDate = new Date('2025-08-01T10:00:00+08:00');
    const endDate = new Date('2025-08-01T11:00:00+08:00');

    // 時區 ISO 格式
    createEvent(
    '測試行程',
    startDate.toISOString(),
    endDate.toISOString()
    );
}

// [開發測試用] 如需測試請取消註解
// createTestEvent();

function createEvent(summary, startDateTime, endDateTime) {
    const event = {
        summary,
        start: {
            dateTime: startDateTime,
            timeZone: 'Asia/Taipei',
        },
        end: {
            dateTime: endDateTime,
            timeZone: 'Asia/Taipei',
        },
    };

    gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
    }).then(response => {
        message.value = '成功建立行程：';
        eventLink.value = response.result.htmlLink;
        isLink.value = true;
        console.log('行程建立成功', response);
    }).catch(error => {
        message.value = '建立行程錯誤：' + error.message;
        console.error('建立行程失敗', error)
    })
}
// ✅ 複製連結功能
function copyLink() {
    if (eventLink.value) {
        navigator.clipboard.writeText(eventLink.value)
            .then(() => alert('連結已複製！'))
            .catch(err => alert('失敗：' + err))
    }
}
</script>
