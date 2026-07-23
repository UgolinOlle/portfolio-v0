import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function StatusCard() {
  return (
    <Card className="w-72">
      <CardHeader className="flex flex-row items-center justify-between">
        <p className="font-medium">Deployment</p>
        <Badge variant="secondary">Online</Badge>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Last updated 2 minutes ago.
      </CardContent>
    </Card>
  );
}
