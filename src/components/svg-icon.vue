<template>
  <svg class="svg-icon"
    aria-hidden="true">
    <use :xlink:href="'#svg-' + icon"></use>
  </svg>
</template>

<script>

export default {
  name: 'SvgIcon',
  props: {
    icon: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
