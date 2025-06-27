import { ref, onMounted } from 'vue';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOCS = [import.meta.env.VITE_DISCOVERY_DOCS];
const SCOPES = import.meta.env.VITE_SCOPES;

const gapiRef = ref(null);
const tokenClientRef = ref(null);
const gisLoaded = ref(false);
const gapiClientInitialized = ref(false);

export function useGoogleCalendar() {
  const message = ref('');
  const eventLink = ref('');
  const loading = ref(false);

  let currentTripToProcess = null;

  const loadGapi = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client', () => {
          gapiRef.value = window.gapi;
          resolve();
        });
      };
      document.head.appendChild(script);
    });
  };

  const loadGis = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        gisLoaded.value = true;
        tokenClientRef.value = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: async (resp) => {
            if (resp.error) {
              console.error("OAuth 認證錯誤", resp);
              message.value = "Google 認證失敗：" + resp.error;
              eventLink.value = '';
              loading.value = false;
              currentTripToProcess = null;
              return;
            }
            try {
              gapiRef.value.client.setToken(resp);
              if (currentTripToProcess) {
                message.value = "認證成功！正在建立行程...";
                eventLink.value = '';
                await createCalendarEventFromTrip(currentTripToProcess);
              } else {
                loading.value = false;
              }
            } catch (error) {
              console.error("建立行程失敗 (認證後)", error);
              message.value = "建立行程失敗：" + (error.result?.error?.message || error.message || '未知錯誤');
              eventLink.value = '';
              loading.value = false;
            } finally {
              currentTripToProcess = null;
            }
          },
          error_callback: (err) => {
            console.error('GIS token client error:', err);
            message.value = 'Google 認證初始化錯誤。';
            eventLink.value = '';
            loading.value = false;
            currentTripToProcess = null;
          }
        });
        resolve();
      };
      document.head.appendChild(script);
    });
  };

  onMounted(async () => {
    try {
      await Promise.all([loadGapi(), loadGis()]);

      await gapiRef.value.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
      });

      await gapiRef.value.client.load('calendar', 'v3');

      gapiClientInitialized.value = true;
      console.log('Google API Client and Calendar API initialized.');

    } catch (err) {
      console.error('初始化 Google API 失敗:', err);
      message.value = 'Google API 載入或初始化失敗，請檢查 API 金鑰或網路連線。';
      eventLink.value = '';
    }
  });

  const authorizeAndCreateEvent = async (trip) => {
    loading.value = true;
    message.value = '';
    eventLink.value = '';

    if (!gapiClientInitialized.value || !gisLoaded.value || !tokenClientRef.value) {
      message.value = "Google 服務初始化中，請稍候...";
      return;
    }
    
    if (!trip) {
      message.value = "沒有行程資料可供匯出。";
      loading.value = false;
      return;
    }

    try {
      currentTripToProcess = trip;

      if (gapiRef.value.client.getToken() === null) {
          console.log('No existing token, requesting new access token...');
          message.value = "正在請求 Google 認證...";
          tokenClientRef.value.requestAccessToken();
      } else {
          console.log('Existing token found, proceeding to create event.');
          message.value = "正在建立行程...";
          await createCalendarEventFromTrip(trip);
      }
    } catch (error) {
      console.error("授權或建立行程錯誤:", error);
      message.value = "操作失敗：" + (error.message || '未知錯誤');
      loading.value = false;
      currentTripToProcess = null;
    }
  };

  const createCalendarEventFromTrip = async (trip) => {
    if (!gapiRef.value || !gapiRef.value.client || !gapiRef.value.client.calendar) {
      message.value = "Google Calendar API 未完全載入。";
      loading.value = false;
      return;
    }

    const { title, startDate, endDate, description } = trip;

    const startDateTime = new Date(`${startDate}T09:00:00`);
    const endDateTime = new Date(`${endDate}T18:00:00`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        message.value = '行程日期格式不正確。';
        loading.value = false;
        return;
    }

    const event = {
      summary: title,
      description: description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "Asia/Taipei",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Asia/Taipei",
      },
    };

    try {
      const response = await gapiRef.value.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });
      console.log("行程建立成功", response.result);
      message.value = "行程已成功加入 Google Calendar！";
      eventLink.value = response.result.htmlLink;
    } catch (error) {
      console.error("建立行程失敗", error);
      message.value = "建立行程錯誤：" + (error.result?.error?.message || error.message || '未知錯誤'); // 紅色訊息
      eventLink.value = '';
    } finally {
      loading.value = false;
    }
  };

  return {
    message,
    eventLink,
    loading,
    authorizeAndCreateEvent,
  };
}