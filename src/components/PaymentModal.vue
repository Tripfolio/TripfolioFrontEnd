<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div class="backdrop-blur-lg bg-[#878787]/30 w-full max-w-md rounded-2xl p-6 shadow-xl relative">
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-white hover:text-black text-2xl"
      >×</button>

      <!-- 付款結果訊息 -->
      <div v-if="result === 'success'" class="text-center  text-white p-6 rounded">
        <h2 class="text-2xl font-bold mb-2">{{ $t('paymentModal.success') }}</h2>
        <p class="text-white mb-4">{{ $t('paymentModal.successMessage') }}</p>
        <button @click="$emit('close')" class="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded shadow">
          {{ $t('paymentModal.close') }}
        </button>
      </div>

      <div v-else-if="result === 'fail'" class="text-center  text-white p-6 rounded">
        <h2 class="text-2xl font-bold mb-2">{{ $t('paymentModal.fail') }}</h2>
        <p class="text-white mb-4">{{ $t('paymentModal.failMessage') }}</p>
        <button @click="$emit('close')" class="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded shadow">
          關閉
        </button>
      </div>

      <!-- 主付款表單 -->
      <div v-else>
        <h1 class="text-2xl font-bold mb-4 text-center text-white">{{ $t('paymentModal.upgradeToPremium') }}</h1>
        <p class="mb-6 text-center text-white">{{ $t('paymentModal.payAmount') }} <span class="font-semibold text-xl">
          NT$ {{ paymentAmount }}</span> {{ $t('paymentModal.moreTrips') }}
        </p>


        <div v-if="isPremium" class="text-center bg-green-50 border border-green-300 text-green-700 p-4 rounded mb-4">
          {{ $t('paymentModal.alreadyPremium') }}
        </div>

        <div v-else>
          <div class="mb-4 text-center">
            <div v-if="linePayLoading" class="text-white font-medium">{{ $t('paymentModal.linePayLoading') }}</div>
            <button
              v-if="!linePayLoading"
              @click="handleLinePay"
              class="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-lg text-lg shadow w-3/4 max-w-xs"
            >
              {{ $t('paymentModal.goToLinePay') }}
            </button>
          </div>

          <div class="border-t border-gray-300 pt-4 mt-4 text-center">
            <button
              @click="toggleCreditCardPayment"
              v-if="!showCreditCardDetails"
              class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-lg shadow w-3/4 max-w-xs"
            >
              {{ $t('paymentModal.useCreditCard') }}
            </button>

            <div v-if="showCreditCardDetails" class="mt-4">
              <p class="text-lg text-white  font-semibold mb-2">{{ $t('paymentModal.creditCardPayment') }}</p>
              <p v-if="dropinisReady" class="text-white mb-2 text-sm">
                {{ $t('paymentModal.testCardNumber') }}
              </p>
              <div id="dropin-container" class="border rounded p-2 bg-gray-50 mb-4"></div>
              <div class="space-y-2">
                <button
                  v-if="!dropinisReady"
                  @click="initDropin"
                  class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-lg shadow w-3/4 max-w-xs"
                >
                  {{ braintreeLoading ? $t('paymentModal.loading') : $t('paymentModal.initCreditCardPayment') }}
                </button>
                <button
                  v-if="dropinisReady"
                  @click="submitBraintreePayment"
                  :disabled="braintreeLoading"
                  class="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-lg text-lg shadow w-3/4 max-w-xs"
                >
                  {{ $t('paymentModal.confirmCreditCardPayment') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import axios from 'axios';
import dropin from 'braintree-web-drop-in';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const props = defineProps({
  result: String
});

const linePayLoading = ref(false);
const isPremium = ref(false);

const dropinInstance = ref(null);
const dropinisReady = ref(false);
const braintreeLoading = ref(false);
const paymentAmount = ref("30");

const showCreditCardDetails = ref(false);

const getToken = () => localStorage.getItem('token');

const checkPremium = async () => {
  const token = getToken();
  if (!token) {
    isPremium.value = false;
    return;
  }
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/linepay/check-status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    isPremium.value = res.data?.isPremium;
  } catch (err) {
    console.error('檢查會員狀態失敗:', err);
    isPremium.value = false;
  }
};

checkPremium();

const handleLinePay = async () => {
  const token = getToken();
  if (!token) {
    alert('請先登入才能進行付款。');
    return;
  }
  linePayLoading.value = true;
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/linepay/request`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (res.data && res.data.url) {
      window.location.href = res.data.url;
    } else {
      alert('無法獲取 Line Pay 付款連結，請稍後再試。');
    }
  } catch (err) {
    console.error('LINE Pay 初始化失敗:', err);
    alert('LINE Pay 付款初始化失敗，請檢查網路連線或稍後再試。');
  } finally {
    linePayLoading.value = false;
  }
};

const initDropin = async () => {
  braintreeLoading.value = true;
  const token = getToken();
  if (!token) {
    alert('請先登入才能進行付款。');
    braintreeLoading.value = false;
    return;
  }
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/payment/client_token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const clientToken = res.data.token;
    paymentAmount.value = res.data.amount || paymentAmount.value;

    dropin.create(
      {
        authorization: clientToken,
        container: "#dropin-container",
      },
      (err, instance) => {
        if (!err && instance) {
          dropinInstance.value = instance;
          dropinisReady.value = true;
        } else {
          console.error('Braintree Drop-in 初始化失敗:', err);
          alert('信用卡付款介面載入失敗，請稍後再試。');
        }
        braintreeLoading.value = false;
      },
    );
  } catch (err) {
    console.error('獲取 Braintree Client Token 失敗:', err);
    alert('無法獲取信用卡付款 Client Token，請檢查網路連線或稍後再試。');
    braintreeLoading.value = false;
  }
};

const submitBraintreePayment = async () => {
  const token = getToken();
  if (!token) {
    alert('請先登入才能進行付款。');
    return;
  }
  if (!dropinInstance.value) {
    alert('信用卡付款介面未準備好。');
    return;
  }

  braintreeLoading.value = true;
  try {
    const payload = await dropinInstance.value.requestPaymentMethod();
    const nonce = payload.nonce;

    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/payment/confirm`,
      {
        paymentMethodNonce: nonce,
        amount: paymentAmount.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (result.data.success) {
      const amountPaid = result.data.transaction.amount;
      const txnId = result.data.transaction.id;
      alert(`付款成功！金額：NT$${amountPaid}\n交易編號：${txnId}`);
      isPremium.value = true;
    } else {
      alert("付款失敗：" + (result.data.message || '未知錯誤'));
    }
  } catch (err) {
    console.error('信用卡付款失敗:', err);
    alert("信用卡付款失敗，請稍後再試。");
  } finally {
    braintreeLoading.value = false;
  }
};

const toggleCreditCardPayment = () => {
  showCreditCardDetails.value = !showCreditCardDetails.value;
  if (showCreditCardDetails.value && !dropinInstance.value) {
    initDropin();
  }
};
</script>
