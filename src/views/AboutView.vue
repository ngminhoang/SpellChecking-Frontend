<template>
  <div class="about">
    <div class="about-info">
      <h2 class="green">Xin tự giới thiệu</h2>
      <p>Đây là 1 page hỗ trợ kiểm tra chính tả Tiếng Anh cho các website, hoàn toàn miễn phí và phi lợi nhuận nhé anh
        em.</p>
    </div>
    <div class="giphy-container">
      <iframe class="giphy-iframe" :src="giphy1Src" width="286" height="480"></iframe>
    </div>
    <div class="giphy-container">
      <iframe class="giphy-iframe" :src="giphy2Src" width="360" height="480"></iframe>
    </div>
    <div class="giphy-container">
      <iframe class="giphy-iframe" :src="giphy3Src" width="390" height="480" allowfullscreen></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
const giphy1Src = "https://giphy.com/embed/CAYVZA5NRb529kKQUc";
const giphy2Src = "https://giphy.com/embed/VuoqI5nbYTTKhIv7Tr";
const giphy3Src = "https://giphy.com/embed/hKdDsk1BreTaGaHB7d";
</script>

<style scoped>
.about {
  display: flex;
  align-items: center;
}

.about-info {
  width: 250px;
  margin-right: 50px;
}

.green {
  color: #ba5eff;
}

.giphy-container {
  margin-bottom: 20px;
}

.giphy-iframe {
  pointer-events: auto;
}
</style>
