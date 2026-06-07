"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ExternalLink,
  FileText,
  Loader2,
  Send,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CopyLinkButton } from "@/components/copy-link-button";
import { PortalForm } from "@/components/portal-form";
import type { Message, Portal, PortalFile } from "@/lib/types";

type Props = {
  portal: Portal;
  files: PortalFile[];
  messages: Message[];
  link: string;
  updateAction: (formData: FormData) => Promise<void>;
  uploadAction: (formData: FormData) => Promise<void>;
  replyAction: (formData: FormData) => Promise<void>;
};

export function PortalDetailClient({
  portal,
  files,
  messages: initialMessages,
  link,
  updateAction,
  uploadAction,
  replyAction
}: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyRef = useRef<HTMLFormElement>(null);

  const [isUploading, startUpload] = useTransition();
  const [isReplying, startReply] = useTransition();
  const [uploadDone, setUploadDone] = useState(false);
  const [replySent, setReplySent] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  async function handleUpload(formData: FormData) {
    startUpload(async () => {
      await uploadAction(formData);
      setUploadDone(true);
      setSelectedFiles(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setUploadDone(false), 2500);
      router.refresh();
    });
  }

  async function handleReply(formData: FormData) {
    startReply(async () => {
      await replyAction(formData);
      replyRef.current?.reset();
      setReplySent(true);
      setTimeout(() => setReplySent(false), 2500);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* Left column */}
      <div className="space-y-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{portal.project_title}</h1>
          <p className="mt-1.5 text-[0.9375rem] text-zinc-500">{portal.client_name}</p>
        </div>

        {/* Edit portal form */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-card">
          <h2 className="font-semibold tracking-tight mb-5">Edit portal</h2>
          <PortalForm action={updateAction} portal={portal} submitLabel="Save changes" />
        </div>

        {/* Messages */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-card">
          <h2 className="font-semibold tracking-tight mb-4">Messages</h2>
          <div className="max-h-80 space-y-2.5 overflow-y-auto">
            {initialMessages.length ? (
              initialMessages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.sender === "freelancer"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm bg-zinc-100 px-3.5 py-2.5 text-sm text-zinc-800"
                  }
                >
                  <p className="mb-1 text-xs opacity-60 font-medium">
                    {message.sender === "freelancer" ? "You" : portal.client_name}
                  </p>
                  <p className="leading-relaxed">{message.content}</p>
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-zinc-50 px-4 py-4 text-sm text-zinc-400 border border-zinc-100">
                No messages yet. Clients can message you from their portal link.
              </p>
            )}
          </div>
          <form ref={replyRef} action={handleReply} className="mt-4 space-y-2.5">
            <Textarea
              name="content"
              placeholder="Send a message to your client…"
              required
              className="resize-none rounded-xl border-zinc-200 text-sm focus:border-emerald-400 focus:ring-emerald-400/20"
            />
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isReplying} className="rounded-xl" size="sm">
                {isReplying ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…</>
                ) : replySent ? (
                  <><Check className="h-3.5 w-3.5" /> Sent!</>
                ) : (
                  <><Send className="h-3.5 w-3.5" /> Send message</>
                )}
              </Button>
              {replySent && <p className="text-sm text-emerald-600">Message sent.</p>}
            </div>
          </form>
        </div>
      </div>

      {/* Right sidebar */}
      <aside className="space-y-5">
        {/* Client link */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-card">
          <h2 className="font-semibold tracking-tight mb-3">Client link</h2>
          <div className="break-all rounded-xl bg-zinc-50 border border-zinc-100 px-3 py-2.5 text-xs text-zinc-500 font-mono">
            {link}
          </div>
          <div className="mt-3 flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1 rounded-lg">
              <a href={link} target="_blank">
                <ExternalLink className="h-3.5 w-3.5" />
                Preview
              </a>
            </Button>
            <CopyLinkButton link={link} />
          </div>
          <div className="mt-3">
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200/60">
              {portal.status_text}
            </span>
          </div>
        </div>

        {/* Files */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-card">
          <h2 className="font-semibold tracking-tight mb-4">Files</h2>
          <div className="space-y-1.5 mb-4">
            {files.length ? (
              files.map((file) => (
                <a
                  key={file.id}
                  href={file.file_url}
                  target="_blank"
                  className="group flex items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5 text-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
                  <span className="truncate text-zinc-700">{file.file_name}</span>
                </a>
              ))
            ) : (
              <p className="text-xs text-zinc-400 py-1">No files uploaded yet.</p>
            )}
          </div>

          <form action={handleUpload} className="space-y-2.5">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-zinc-200 p-5 text-center transition-colors hover:border-emerald-300 hover:bg-emerald-50/50">
              <Upload className="h-4 w-4 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-600">
                {selectedFiles && selectedFiles.length > 0
                  ? `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} selected`
                  : "Click to choose files"}
              </span>
              <span className="text-xs text-zinc-400">Any file type</span>
              <input
                ref={fileInputRef}
                name="files"
                type="file"
                multiple
                required
                className="hidden"
                onChange={(e) => setSelectedFiles(e.target.files)}
              />
            </label>

            <Button
              type="submit"
              className="w-full rounded-xl"
              variant="outline"
              size="sm"
              disabled={isUploading || !selectedFiles?.length}
            >
              {isUploading ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…</>
              ) : uploadDone ? (
                <><Check className="h-3.5 w-3.5 text-emerald-500" /> Uploaded!</>
              ) : (
                "Upload files"
              )}
            </Button>
          </form>
        </div>
      </aside>
    </div>
  );
}
