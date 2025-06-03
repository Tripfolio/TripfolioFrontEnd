<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
defineProps()


//確認會員登入 抓id
const memberId = localStorage.getItem('memberId') || '1'
if (!memberId) {
  alert('請先登入會員')
  throw new Error('memberId 不存在')
}

//元件掛載時載入會員資料
onMounted(async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/members/${memberId}`)
    const data = res.data

    //生日時區
    if (data.birthday) {
      const date = new Date(data.birthday)
      const adjustedDate = new Date(date.getTime() + (8 * 60 * 60 * 1000))
      data.birthday = adjustedDate.toISOString().slice(0, 10)
    }

    profileData.value = {
      ...data,
      avatar: data.avatar || ''
    }
  } catch (error) {
    console.error('讀取會員資料失敗', error)
  }
})

const profileData = ref({
    name: '',
    gender: '',
    phone: '',
    email: '',
    birthday: '',
    avatar: '',
}) 

const avatarFile = ref(null)
const previewUrl = ref('')


//上傳大頭貼圖片預覽
const uploadAvatar = (event) => {
    avatarFile.value = event.target.files[0]
    if(avatarFile.value) {
        previewUrl.value = URL.createObjectURL(avatarFile.value)
    }
}


//儲存大頭貼傳至後端
const saveAvatar = async () => {
    if(!avatarFile.value) {
        alert('請先選擇圖片')
        return
    }

    const formData = new FormData()
    formData.append('avatar', avatarFile.value)
    formData.append('memberId', memberId)

    try {
        const res = await axios.post('http://localhost:3000/api/upload-avatar', formData)
        alert('大頭貼上傳成功')
        
        const profileRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/members/${memberId}`)
        profileData.value = profileRes.data
        previewUrl.value = ''
    } catch (err) {
        console.error('上傳失敗', err)
        alert('上傳失敗')
    }
}


const phoneError = ref('');

//手機號碼格式檢查
watch(() => profileData.value.phone,(newPhone) => {
    const phoneNumber = /^09\d{8}$/;
    if(!phoneNumber.test(newPhone)){
        phoneError.value = '手機格式錯誤，範例：0912345678';
    } else {
        phoneError.value = '';
    }
})

//儲存會員資料送去資料庫
const saveProfile = async () => {
    try {
        const res = await axios.put(`http://localhost:3000/api/members/${memberId}`, profileData.value)
        alert('儲存成功')
        profileData.value = res.data
    } catch (err) {
        console.log('更新失敗：', err)
        alert('儲存失敗')
    }
}

const passwordData = ref({
    oldPassword:'',
    newPassword:'',
    confirmPassword:''
})

const passwordError = ref('')
const showOld = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)


//新密碼格式檢查
watch(() => passwordData.value.newPassword, (newPwd) => {
    const hasMinLength = newPwd.length >= 8
    const hasLetter = /[A-Za-z]/.test(newPwd)
    const hasNumber = /\d/.test(newPwd)
    const isSameAsName = newPwd === profileData.value.name
    const isSameAsEmail = newPwd === profileData.value.email

    if(!hasMinLength) {
        passwordError.value = '密碼至少需8個字元'
    } else if (!hasLetter) {
        passwordError.value = '密碼需包含英文字母'
    } else if (!hasNumber) {
        passwordError.value = '密碼需包含數字'
    } else if (isSameAsName || isSameAsEmail) {
        passwordError.value = '密碼不可與帳號相同'
    } else {
        passwordError.value = ''
    }
})


//修改密碼送到後端
const changePassword = async () => {
    if(!passwordData.value.oldPassword || !passwordData.value.newPassword || !passwordData.value.confirmPassword){
        alert('請填寫所有欄位');
        return;
    }
    if (passwordError.value) {
        alert(passwordError.value); 
    return;
    }
    if(passwordData.value.newPassword  !== passwordData.value.confirmPassword){
        alert('新密碼輸入不一致，請重新輸入');
        return;
    }

    try{
        const res = await axios.put(`http://localhost:3000/api/members/${memberId}/password`, { oldPassword:passwordData.value.oldPassword,newPassword:passwordData.value.newPassword
         })
    alert('密碼修改成功');

    passwordData.value.oldPassword = '';
    passwordData.value.newPassword = '';
    passwordData.value.confirmPassword = '';
    } catch(err) {
    const errorMessage = err.response?.data?.error || '舊密碼錯誤';
        alert(errorMessage);
        console.error('密碼修改失敗', err);
  }
}
</script>

<template>
    <div class="profile">

        <h2>資料修改</h2>

        <div>
            <img v-if="previewUrl || profileData.avatar" :src="previewUrl !== '' ? previewUrl : profileData.avatar" alt="大頭貼"/> 
            <input type="file" @change="uploadAvatar" accept="image/*" />
            <button @click="saveAvatar" class="w-24 bg-sky-500/50" >儲存大頭貼</button>
        </div>
        <form @submit.prevent="saveProfile">
            <span>名稱：</span>
            <input type="text" v-model="profileData.name" placeholder="名稱" class="border-2 border-solid"/>
            <span>性別：</span>
            <select name="" id="" v-model="profileData.gender"  class="border-2 border-solid">
                <option value="male">男</option>
                <option value="female">女</option>
            </select>
            <div>
                <span>手機號碼：</span>
                <input type="tel" v-model="profileData.phone" placeholder="手機號碼"  class="border-2 border-solid"/>
                <p v-if="phoneError" style="color:red">{{ phoneError }}</p>
            </div>
            <!-- <input type="email" v-model="profileData.email" placeholder="電子郵件" /> -->
            <span>生日：</span>
            <input type="date" v-model="profileData.birthday"  class="border-2 border-solid"/>
            <button type="submit" class="w-24 bg-sky-500/50">儲存會員資料</button>
        </form>

        <h2>密碼修改</h2>
        <form @submit.prevent="changePassword">
            <div>
                <input :type="showOld? 'text' : 'password'" v-model="passwordData.oldPassword" placeholder="舊密碼"  class="border-2 border-solid"/>
                <span @click="showOld = !showOld">
                    <font-awesome-icon :icon="showOld ? 'fa-eye-slash' : 'fa-eye'" />
                </span>
            </div>
            <div>
                <input :type="showNew? 'text' : 'password'" v-model="passwordData.newPassword" placeholder="新密碼"  class="border-2 border-solid"/>
                <span @click="showNew = !showNew">
                    <font-awesome-icon :icon="showNew ? 'fa-eye-slash' : 'fa-eye'" />
                </span>     
                <p>需輸入8位以上字元，密碼需包含數字+英文</p>
                <p v-if="passwordError" style="color:red">{{ passwordError }}</p>    
            </div>
            <div>
                <input :type="showConfirm? 'text' : 'password'" v-model="passwordData.confirmPassword" placeholder="再次輸入新密碼"  class="border-2 border-solid"/>
                <span @click="showConfirm = !showConfirm">
                    <font-awesome-icon :icon="showConfirm ? 'fa-eye-slash' : 'fa-eye'" />
                </span>
            </div>
            <button type="submit" class="w-24 bg-sky-500/50">送出修改密碼</button>
        </form>
    </div>
</template>


<style>

</style>