<template>
  <!-- <div v-if="visible" class="loading-wrapper">
    <div class="loading-content">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <span class="loading-text">{{ text }}</span>
    </div>
  </div> -->

  <div v-if="visible" class="loading-wrapper">
    <!-- <div class="filter-blur"></div> -->
    <div class="webview-loading">
      <div class="modelViewPort">
        <div class="eva">
          <div class="head">
            <div class="eyeChamber">
              <div class="eye"></div>
              <div class="eye"></div>
            </div>
          </div>
          <div class="body">
            <div class="hand"></div>
            <div class="hand"></div>
            <div class="scannerThing"></div>
            <div class="scannerOrigin"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: '加载中...'
  }
})
</script>

<style scoped lang="scss">
// .filter-blur{
//   width: 100%;
//   height: 100%;
//   position: fixed;
//   // z-index: 99;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   // background: rgba(255, 255, 255, .7);

// }

.loading-wrapper {
  position: fixed;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

// .loading-content {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 10px;
// }

// .loading-icon {
//   font-size: 40px;
//   color: var(--el-color-primary);
//   animation: rotate 1s linear infinite;
// }

// .loading-text {
//   color: var(--el-color-primary);
//   font-size: 14px;
// }

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 机器人加载动画 */
.webview-loading {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  // background: #000;
  z-index: 10;

  backdrop-filter: blur(6px);

  /* From Uiverse.io by Subaashbala */
  .modelViewPort {
    /* The black circle background around the model*/
    perspective: 1000px;
    width: 20rem;
    aspect-ratio: 1;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    // background: #000;
    overflow: hidden;
  }
  .eva {
    --EVA-ROTATION-DURATION: 3s;
    transform-style: preserve-3d;
    animation: rotateRight var(--EVA-ROTATION-DURATION) linear infinite alternate;
  }
  .head {
    position: relative;
    width: 6rem;
    height: 4rem;
    border-radius: 48% 53% 45% 55% / 79% 79% 20% 22%;
    background: linear-gradient(to right, white 45%, gray);
  }
  .eyeChamber {
    width: 4.5rem;
    height: 2.75rem;
    position: relative;
    left: 50%;
    top: 55%;
    border-radius: 45% 53% 45% 48% / 62% 59% 35% 34%;
    background-color: #0c203c;
    box-shadow:
      0px 0px 2px 2px white,
      inset 0px 0px 0px 2px black;
    transform: translate(-50%, -50%);
    animation: moveRight var(--EVA-ROTATION-DURATION) linear infinite alternate;
  }
  .eye {
    width: 1.2rem;
    height: 1.5rem;
    position: absolute;
    border-radius: 50%;
  }
  .eye:first-child {
    left: 12px;
    top: 50%;
    background: repeating-linear-gradient(65deg, #9bdaeb 0px, #9bdaeb 1px, white 2px);
    box-shadow:
      inset 0px 0px 5px #04b8d5,
      0px 0px 15px 1px #0bdaeb;
    transform: translate(0, -50%) rotate(-65deg);
  }
  .eye:nth-child(2) {
    right: 12px;
    top: 50%;
    background: repeating-linear-gradient(-65deg, #9bdaeb 0px, #9bdaeb 1px, white 2px);
    box-shadow:
      inset 0px 0px 5px #04b8d5,
      0px 0px 15px 1px #0bdaeb;
    transform: translate(0, -50%) rotate(65deg);
  }
  .body {
    width: 6rem;
    height: 8rem;
    position: relative;
    margin-block-start: 0.25rem;
    border-radius: 47% 53% 45% 55% / 12% 9% 90% 88%;
    background: linear-gradient(to right, white 35%, gray);
  }
  .hand {
    position: absolute;
    left: -1.5rem;
    top: 0.75rem;
    width: 2rem;
    height: 5.5rem;
    border-radius: 40%;
    background: linear-gradient(to left, white 15%, gray);
    box-shadow: 5px 0px 5px rgba(0, 0, 0, 0.25);
    transform: rotateY(55deg) rotateZ(10deg);
  }
  .hand:first-child {
    animation: compensateRotation var(--EVA-ROTATION-DURATION) linear infinite alternate;
  }
  .hand:nth-child(2) {
    left: 92%;
    background: linear-gradient(to right, white 15%, gray);
    transform: rotateY(55deg) rotateZ(-10deg);
    animation: compensateRotationRight var(--EVA-ROTATION-DURATION) linear infinite alternate;
  }
  .scannerThing {
    width: 0;
    height: 0;
    position: absolute;
    left: 60%;
    top: 10%;
    border-top: 180px solid #9bdaeb;
    border-left: 250px solid transparent;
    border-right: 250px solid transparent;
    transform-origin: top left;
    mask: linear-gradient(to right, white, transparent 35%);
    animation: glow 2s cubic-bezier(0.86, 0, 0.07, 1) infinite;
  }
  .scannerOrigin {
    position: absolute;
    width: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    left: 60%;
    top: 10%;
    background: #9bdaeb;
    box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.5);
    animation: moveRight var(--EVA-ROTATION-DURATION) linear infinite;
  }
  @keyframes rotateRight {
    from {
      transform: rotateY(0deg);
    }
    to {
      transform: rotateY(25deg);
    }
  }
  @keyframes moveRight {
    from {
      transform: translate(-50%, -50%);
    }
    to {
      transform: translate(-40%, -50%);
    }
  }
  @keyframes compensateRotation {
    from {
      transform: rotateY(55deg) rotateZ(10deg);
    }
    to {
      transform: rotatey(30deg) rotateZ(10deg);
    }
  }
  @keyframes compensateRotationRight {
    from {
      transform: rotateY(55deg) rotateZ(-10deg);
    }
    to {
      transform: rotateY(70deg) rotateZ(-10deg);
    }
  }
  @keyframes glow {
    from {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    45% {
      transform: rotate(-25deg);
    }
    75% {
      transform: rotate(5deg);
    }
    100% {
      opacity: 0;
    }
  }
}
</style>
