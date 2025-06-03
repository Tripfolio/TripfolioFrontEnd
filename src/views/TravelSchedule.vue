<script setup>


</script>


<template>
    <div class="h-screen flex items-center justify-center">
        <form class="w-80 h-96 border-2 border-soli flex items-center justify-center">
            <span>行程設定</span>
            <br>
            <br>
            <input type="text" class="border-2 border-gray-700 focus:border-pink-600 ..." placeholder="行程名稱"/>
             <span>行程日期</span>           
            <input type="date" class="border-2 border-gray-700 focus:border-pink-600 ..." placeholder="開始"/>
            <input type="date" class="border-2 border-gray-700 focus:border-pink-600 ..." placeholder="結束"/>
            <input type="text" class="border-2 border-gray-700 focus:border-pink-600 ..." placeholder="行程描述"/>
            <button>取消</button>
            <button>儲存</button>
        </form>
    </div>
</template>

<style>


</style>