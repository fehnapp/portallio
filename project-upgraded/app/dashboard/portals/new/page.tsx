import { createPortal } from "@/app/actions";
import { PortalForm } from "@/components/portal-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPortalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create portal</h1>
        <p className="mt-1 text-muted-foreground">
          Add the essentials your client needs in one link.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Portal details</CardTitle>
        </CardHeader>
        <CardContent>
          <PortalForm action={createPortal} submitLabel="Create portal" />
        </CardContent>
      </Card>
    </div>
  );
}
