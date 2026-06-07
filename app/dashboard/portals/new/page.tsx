import { createPortal } from "@/app/actions";
import { PortalForm } from "@/components/portal-form";

export default function NewPortalPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create portal</h1>
        <p className="mt-1.5 text-sm text-zinc-500">Add the essentials your client needs — all in one link.</p>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8" style={{boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
        <PortalForm action={createPortal} submitLabel="Create portal" />
      </div>
    </div>
  );
}
