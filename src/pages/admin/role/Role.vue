<script setup>
import PageHeader from '@/components/PageHeader.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RoleList from './RoleList.vue'
import MenuRole from './MenuRole.vue'
import UserRole from './UserRole.vue'
</script>

<template>
  <div class="py-4">
    <PageHeader title="권한관리" />
    <Tabs default-value="role">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="role">권한관리</TabsTrigger>
        <TabsTrigger value="menuByRole">권한별 메뉴관리</TabsTrigger>
        <TabsTrigger value="menuByUser">권한별 사용자관리</TabsTrigger>
      </TabsList>
      <TabsContent value="role" class="pt-4">
        <RoleList />
      </TabsContent>
      <TabsContent value="menuByRole" class="pt-4">
        <MenuRole />
      </TabsContent>
      <TabsContent value="menuByUser" class="pt-4">
        <UserRole />
      </TabsContent>
    </Tabs>
  </div>
</template>
