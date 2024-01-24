<template>
  <div class="color-primary" id="wrapper">
    <div id="triangle">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 129 115">
        <defs />
        <path
          fill="currentColor"
          d="M64.5 0L129 115H0L64.5 0zm0 24.531L20.489 103h88.021L64.5 24.531z"
        />
      </svg>
    </div>
    <div id="circle">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 129 129">
        <defs />
        <path
          fill="currentColor"
          d="M64.5 0C100.122 0 129 28.878 129 64.5S100.122 129 64.5 129 0 100.122 0 64.5 28.878 0 64.5 0zm0 12C35.505 12 12 35.505 12 64.5S35.505 117 64.5 117 117 93.495 117 64.5 93.495 12 64.5 12z"
        />
      </svg>
    </div>
    <div id="cross">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110">
        <defs />
        <path
          fill="currentColor"
          d="M101 .515L109.485 9l-46 46 46 46-8.485 8.485-46-46-46 46L.515 101l46-46-46-46L9 .515l46 46 46-46z"
        />
      </svg>
    </div>
    <div id="square">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 113 113">
        <defs />
        <path fill="currentColor" d="M113 0v113H0V0h113zm-12 12H12v89h89V12z" />
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$unit: 24px;

#wrapper {
  width: calc($unit * 2);
  height: calc($unit * 2);
}

#wrapper div {
  width: $unit;
  height: $unit;
  float: left;
  text-align: center;
  line-height: 4.5;
}

svg {
  width: 70%;
}

#triangle svg {
  animation: rotateAnimation 3s ease-in-out infinite;
}

#square svg {
  animation: rotateAnimation 3s 1s ease-in-out infinite;
}

#circle svg {
  animation: rotateAnimation 3s 0.5s ease-in-out infinite;
}

#cross svg {
  animation: rotateAnimation 3s 2s ease-in-out infinite;
}

@keyframes rotateAnimation {
  0% {
    transform: rotate(0) scale(1);
  }
  50% {
    transform: rotate(120deg) scale(0);
  }
  70% {
    transform: rotate(-120deg) scale(0);
  }
  100% {
    transform: rotate(0) scale(1);
  }
}
</style>
