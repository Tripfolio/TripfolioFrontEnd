<template>
  <div>
      <p>{{ message }}</p> <!-- ❌ message 未定義 (no-undef) -->
  </div>
</template>

<script setup>
var unusedVar = 123 // ❌ 使用 var (no-var)；❌ 未使用變數 (no-unused-vars)

let msg = "Hello world" // ❌ 使用雙引號 (quotes)；❌ msg 未使用 (no-unused-vars)

if(msg == 'Hello') { // ❌ 使用 == 而非 === (eqeqeq)
  console.log('This should trigger ESLint') // ❌ 使用 console.log (no-console)
}

function add(a, b) {
return a + b           // ❌ 錯誤縮排 (indent)
}                      // ❌ 函數結束後少了分號 (semi)

add(1, 2)
</script>
