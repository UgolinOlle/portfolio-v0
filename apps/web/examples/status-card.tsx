import { Badge } from '@portfolio-v0/shadcn/components/badge';
import { Card, CardContent, CardHeader } from '@portfolio-v0/shadcn/components/card';

export default function StatusCardExample() {
  return (
    <Card className="w-72">
      <CardHeader className="flex flex-row items-center justify-between">
        <p className="font-medium">Déploiement</p>
        <Badge variant="secondary">En ligne</Badge>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Dernière mise à jour il y a 2 minutes.
      </CardContent>
    </Card>
  );
}
