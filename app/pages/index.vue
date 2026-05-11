<template>
  <div></div>
</template>

<script lang="ts" setup>
const token = useCookie('auth_token')
await navigateTo(token.value ? '/dashboard' : '/login')
</script>
