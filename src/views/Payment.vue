<template>
  <div class="p-10 max-w-md mx-auto text-center">
    <h1 class="text-2xl font-bold mb-4">選擇付款方式</h1>
    <p class="text-lg font-semibold text-gray-700 mb-2">
      付費會員，一次買斷只要：${{ paymentAmount }}
    </p>
    <p v-if="dropinisReady" class="text-gray-600 mb-6">
      使用卡號 ( 4111 1111 1111 1111 ) 付款
    </p>
    <div id="dropin-container" class="mb-6"></div>
    <button
      @click="initDropin"
      :disabled="isLoading"
      v-if="!dropinisReady"
      class="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded shadow"
    >
      {{ isLoading ? "載入中..." : "信用卡" }}
    </button>
    <button
      v-if="dropinisReady"
      @click="submitPayment"
      class="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded shadow"
    >
      確認送出
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import dropin from "braintree-web-drop-in";
import axios from "axios";

const router = useRouter();
const dropinInstance = ref(null);
const dropinisReady = ref(false);
const isLoading = ref(false);
const paymentAmount = ref("30.0");

const initDropin = async () => {
  isLoading.value = true;
  const token = localStorage.getItem("token");
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/payment/client_token`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const clientToken = res.data.token;
  paymentAmount.value = res.data.amount || "30.0";

  dropin.create(
    {
      authorization: clientToken,
      container: "#dropin-container",
    },
    (err, instance) => {
      if (!err && instance) {
        dropinInstance.value = instance;
        dropinisReady.value = true;
      }
      isLoading.value = false;
    },
  );
};

const submitPayment = async () => {
  const token = localStorage.getItem("token");

  try {
    const payload = await dropinInstance.value.requestPaymentMethod();
    const nonce = payload.nonce;

    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/payment/confirm`,
      {
        paymentMethodNonce: nonce,
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
      router.push("/schedule");
    } else {
      alert("付款失敗：" + result.data.message);
    }
  } catch (err) {
    alert("付款失敗，請稍後再試");
  }
};
</script>
