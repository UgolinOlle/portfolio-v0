'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Demo() {
  return (
    <Tabs className="w-80" defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Manage your account.</TabsContent>
      <TabsContent value="password">Change your password.</TabsContent>
    </Tabs>
  );
}
