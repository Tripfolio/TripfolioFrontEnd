<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">{{ $t('payment.title') }}</h1>
      <p class="mb-6 text-lg text-gray-600">
        {{ $t('payment.description', { amount: paymentAmount }) }}
      </p>

      <div v-if="isPremium" class="text-blue-600 font-medium text-lg mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        {{ $t('payment.isPremiumNotice') }}
      </div>

      <div v-else>
        <div class="mb-6">
          <div v-if="linePayLoading" class="text-green-500 font-medium mb-4">
            {{ $t('payment.linePayLoading') }}
          </div>
          <button
            v-if="!linePayLoading"
            @click="handleLinePay"
            :disabled="braintreeLoading"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ $t('payment.linePayButton') }}
          </button>
        </div>

        <div class="border-t border-gray-200 pt-6 mt-6">
          <button
            @click="toggleCreditCardPayment"
            v-if="!showCreditCardDetails"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ $t('payment.creditCardButton') }}
          </button>

          <div v-if="showCreditCardDetails">
            <p class="text-lg font-semibold text-gray-700 mb-4">{{ $t('payment.creditCardTitle') }}</p>
            <p v-if="dropinisReady" class="text-gray-600 mb-4 text-sm">
              {{ $t('payment.testCardHint') }}
            </p>
            <div id="dropin-container" class="mb-6 border border-gray-300 rounded-lg p-2 bg-white min-h-[100px] flex items-center justify-center bg-gray-50 border-gray-200 p-4"></div>
            <div class="flex flex-col space-y-4">
              <button
                @click="initDropin"
                :disabled="braintreeLoading || linePayLoading"
                v-if="!dropinisReady"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {{ braintreeLoading ? {{ $t('payment.loading') }} : {{ $t('payment.initCreditCard') }} }}
              </button>
              <button
                v-if="dropinisReady"
                @click="submitBraintreePayment"
                :disabled="braintreeLoading || linePayLoading"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {{ $t('payment.confirmCreditCard') }} 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import dropin from 'braintree-web-drop-in';
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const router = useRouter();

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
    console.error(t('payment.error.checkStatusFail'), err);
    isPremium.value = false;
  }
};

const handleLinePay = async () => {
  const token = getToken();
  if (!token) {
    alert(t('payment.alert.loginRequired')); 
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
      alert(t('payment.alert.linePayLinkFail'));
    }
  } catch (err) {
    console.error('LINE Pay 初始化失敗:', err);
    alert(t('payment.alert.linePayInitFail'));
  } finally {
    linePayLoading.value = false;
  }
};

const initDropin = async () => {
  braintreeLoading.value = true;
  const token = getToken();
  if (!token) {
      alert(t('payment.alert.loginRequired'));
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
          alert(t('payment.alert.creditCardLoadFail'));
        }
        braintreeLoading.value = false;
      },
    );
  } catch (err) {
    console.error('獲取 Braintree Client Token 失敗:', err);
    alert(t('payment.alert.clientTokenFail'));
    braintreeLoading.value = false;
  }
};

const submitBraintreePayment = async () => {
  const token = getToken();
  if (!token) {
      alert(t('payment.alert.loginRequired'));
      return;
  }
  if (!dropinInstance.value) {
    alertalert(t('payment.alert.creditCardNotReady'))
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
      alert(t('payment.alert.paymentSuccess', { amount: amountPaid, txnId }));
      isPremium.value = true;
      router.push("/schedule");
    } else {
      alert(t('payment.alert.paymentFail', { message: result.data.message || t("payment.alert.unknownError") }));
    }
  } catch (err) {
    console.error('信用卡付款失敗:', err);
    alert(t('payment.alert.creditCardFail'));
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

onMounted(() => {
  checkPremium();
});
</script>