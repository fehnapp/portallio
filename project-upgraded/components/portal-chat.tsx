"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Message } from "@/lib/types";

export function PortalChat({
  messages,
  action
}: {
  messages: Message[];
  action: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await action(formData);
      formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="max-h-[420px] space-y-2.5 overflow-y-auto">
        {messages.length ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={
                message.sender === "client"
                  ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                  : "max-w-[85%] rounded-2xl rounded-bl-sm bg-zinc-100 px-3.5 py-2.5 text-sm text-zinc-800"
              }
            >
              <p className="mb-1 text-xs opacity-60 font-medium">
                {message.sender === "client" ? "You" : "Freelancer"}
              </p>
              <p className="leading-relaxed">{message.content}</p>
            </div>
          ))
        ) : (
          <p className="rounded-xl bg-zinc-50 px-4 py-4 text-sm text-zinc-400 border border-zinc-100">
            Send a message if you have a question or feedback.
          </p>
        )}
      </div>
      <form ref={formRef} action={handleSubmit} className="mt-4 space-y-2.5">
        <Textarea
          name="content"
          placeholder="Write a message…"
          required
          className="resize-none rounded-xl border-zinc-200 text-sm focus:border-emerald-400 focus:ring-emerald-400/20"
        />
        <Button className="w-full rounded-xl sm:w-auto" disabled={isPending} size="sm">
          <Send className="h-3.5 w-3.5" />
          {isPending ? "Sending…" : "Send message"}
        </Button>
      </form>
    </div>
  );
}
