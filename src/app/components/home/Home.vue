<template>
  <SideMenu></SideMenu>
  <Panel></Panel>
</template>

<script>
import SideMenu from '@/app/components/home/components/Menu'
import Panel from '@/app/components/home/components/Panel'
export default {
  name: 'todo',
  components: { Panel, SideMenu }
}
</script>

<style scoped>

</style>
