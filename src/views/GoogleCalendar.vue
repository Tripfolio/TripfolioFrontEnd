<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <button
      @click="handleAuthClick"
      class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      :disabled="loading"
    >
      {{ loading ? t('googleCalendar.loading') : t('googleCalendar.loginButton') }}
    </button>

    <div
      v-if="message"
      class="mt-4 p-3 rounded border"
      :class="
        message.includes('成功')
          ? 'border-green-500 bg-green-100 text-green-700'
          : 'border-red-500 bg-red-100 text-red-700'
      "
    >
      <p>{{ message }}</p>

      <div v-if="isLink" class="mt-2 space-x-2">
        <a :href="eventLink" target="_blank" rel="noopener noreferrer">
          <button
            class="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition"
          >
            {{ t('googleCalendar.openCalendar') }}
          </button>
        </a>
        <button
          @click="copyLink"
          class="group bg-[#44484d] text-base-content /* font & icon */ py-1 px-2 rounded hover:bg-[#5d636a] transition"
        >
          <font-awesome-icon
            :icon="['fas', 'paste']"
            size="xs"
            class="icon-text-color"
          />
          {{ t('googleCalendar.copyLink') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const message = ref("");
const eventLink = ref("");
const loading = ref(false); //避免使用者重複請求
const isLink = ref(false);

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let gapi = null;
let accessToken = null;
let gapiInitialized = false;

onMounted(() => {
  // 載入 gapi
  const gapiScript = document.createElement("script");
  gapiScript.src = "https://apis.google.com/js/api.js";
  gapiScript.onload = () => {
    gapi = window.gapi;
    gapi.load("client", initializeGapiClient);
  };
  document.body.appendChild(gapiScript);

  // 載入 Google Identity Services (GIS) 的 script
  const gisScript = document.createElement("script");
  gisScript.src = "https://accounts.google.com/gsi/client";
  document.body.appendChild(gisScript);
});

function initializeGapiClient() {
  if (!CLIENT_ID || !API_KEY) {
    console.error("缺少 CLIENT_ID 或 API_KEY");
    message.value = t('googleCalendar.missingEnv');
    return;
  }

  gapi.client
    .init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    })
    .then(() => {
      console.log("GAPI client initialized");
      gapiInitialized = true;
    })
    .catch((err) => {
      console.error("GAPI 初始化失敗", err);
      message.value = t('googleCalendar.initFailed', { error: err.message });
    });
}

function handleAuthClick() {
  if (!gapiInitialized) {
    alert(t('googleCalendar.apiNotReady'));
    return;
  }

  if (!accessToken) {
    accessToken = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (resp) => {
        if (resp.error) {
          message.value = t('googleCalendar.authFailed', { error: resp.error });
          return;
        }
        message.value = t('googleCalendar.authSuccess');
        createTestEvent();
      },
    });
  }

  accessToken.requestAccessToken();
}

function createTestEvent() {
  if (import.meta.env.MODE !== "development") {
    return; // 僅在開發模式下執行
  }
  const startDate = new Date("2025-08-01T10:00:00+08:00");
  const endDate = new Date("2025-08-01T11:00:00+08:00");

  // 時區 ISO 格式
  createEvent(t('googleCalendar.testEventTitle'), startDate.toISOString(), endDate.toISOString());
}

function createEvent(summary, startDateTime, endDateTime) {
  const event = {
    summary,
    start: {
      dateTime: startDateTime,
      timeZone: "Asia/Taipei",
    },
    end: {
      dateTime: endDateTime,
      timeZone: "Asia/Taipei",
    },
  };

  gapi.client.calendar.events
    .insert({
      calendarId: "primary",
      resource: event,
    })
    .then((response) => {
      message.value = t('googleCalendar.createSuccess');
      eventLink.value = response.result.htmlLink;
      isLink.value = true;
      console.log("行程建立成功", response);
    })
    .catch((error) => {
      message.value = t('googleCalendar.createError', { error: error.message });
      console.error("建立行程失敗", error);
    });
}

function copyLink() {
  if (eventLink.value) {
    navigator.clipboard
      .writeText(eventLink.value)
      .then(() => alert(t('googleCalendar.copySuccess')))
      .catch((err) => alert(t('googleCalendar.copyFailed', { error: err })));
}}
</script>
