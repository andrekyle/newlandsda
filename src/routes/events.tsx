import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { EditableText } from "@/components/Editable";
import { Calendar, MapPin, ArrowRight, Plus, Trash2 } from "lucide-react";
import { events, type ChurchEvent } from "@/data/events";
import { useAdmin, useOverride } from "@/lib/admin";
import eventsBanner from "@/assets/events.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events")({
  component: Events,
  head: () => ({
    meta: [
      { title: "Events — Newlands SDA Church" },
      { name: "description", content: "Upcoming events, services, and gatherings at Newlands Seventh-day Adventist Church." },
    ],
  }),
});

function makeSampleEvent(): ChurchEvent {
  const id = `custom-${Date.now().toString(36)}`;
  return {
    id,
    title: "New Event Title",
    date: "Saturday, 1 January 2027",
    time: "10:00",
    location: "Main Sanctuary",
    address: "116 Waterval Road, Newlands, Johannesburg",
    mapQuery: "116+Waterval+Road+Newlands+Johannesburg",
    short: "Short summary of the new event. Click to edit and replace this sample text.",
    description: [
      "First paragraph describing the event. Replace this sample text with the real details.",
      "Second paragraph with any additional context, speakers, or what attendees can expect.",
    ],
    schedule: [
      { time: "10:00", item: "Welcome & opening" },
      { time: "11:00", item: "Main programme" },
      { time: "13:00", item: "Fellowship lunch" },
    ],
  };
}

function Events() {
  const { editMode } = useAdmin();
  const [extras, setExtras] = useOverride<ChurchEvent[]>("events.extras", []);
  const [deletedIds, setDeletedIds] = useOverride<string[]>("events.deleted", []);
  const [pendingDelete, setPendingDelete] = React.useState<ChurchEvent | null>(null);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const allEvents = [...extras, ...events].filter((e) => !deletedIds.includes(e.id));

  const addEvent = () => {
    setExtras([makeSampleEvent(), ...extras]);
  };

  const confirmDelete = () => {
    const target = pendingDelete;
    if (!target) return;
    const nextExtras = extras.filter((e) => e.id !== target.id);
    if (nextExtras.length !== extras.length) {
      setExtras(nextExtras);
    }
    if (!deletedIds.includes(target.id)) {
      setDeletedIds([...deletedIds, target.id]);
    }
    setPendingDelete(null);
  };

  return (
    <PageShell>
      <PageHero title="Upcoming Events" subtitle="Come and be part of what God is doing at Newlands SDA." image={eventsBanner} overlay={false} />
      <section className="mx-auto max-w-4xl px-4 py-16 space-y-4">
        {editMode && (
          <button
            type="button"
            onClick={addEvent}
            className="inline-flex items-center gap-2 bg-black/90 text-white/95 border border-white/15 hover:border-white/25 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 rounded-none px-3 py-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" /> Add Event
          </button>
        )}
        {allEvents.map((e) => (
          <article key={e.id} className={`relative bg-card border border-border/50 p-8 rounded-sm shadow-sm ${e.featured ? "ring-1 ring-primary/30" : ""}`}>
            {editMode && (
              <button
                type="button"
                onClick={() => setPendingDelete(e)}
                title="Delete this event"
                className="absolute top-3 right-3 inline-flex items-center justify-center h-8 w-8 bg-black/90 text-red-400 border border-white/15 hover:border-red-400/60 focus:outline-none focus:ring-1 focus:ring-red-400/30 rounded-none"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            {e.featured && (
              <EditableText
                id={`events.${e.id}.badge`}
                defaultValue="Featured Event"
                as="div"
                className="text-xs font-semibold uppercase tracking-wide text-primary mb-2 block"
              />
            )}
            <EditableText id={`events.${e.id}.title`} defaultValue={e.title} as="h2" className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground block" />
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary shrink-0" /><EditableText id={`events.${e.id}.date`} defaultValue={e.date} />&nbsp;·&nbsp;<EditableText id={`events.${e.id}.time`} defaultValue={e.time} /></span>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary shrink-0" /><EditableText id={`events.${e.id}.location`} defaultValue={e.location} /></span>
            </div>
            <EditableText id={`events.${e.id}.short`} defaultValue={e.short} as="p" multiline className="mt-4 text-muted-foreground leading-relaxed block" />
            <Link
              to="/events/$eventId"
              params={{ eventId: e.id }}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            >
              View details <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </section>
      {mounted && (
        <AlertDialog
          open={pendingDelete !== null}
          onOpenChange={(open) => !open && setPendingDelete(null)}
        >
          {pendingDelete !== null && (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                <AlertDialogDescription>
                  {`\u201c${pendingDelete.title}\u201d will be removed from the events list.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className={cn(buttonVariants({ variant: "destructive" }))}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          )}
        </AlertDialog>
      )}
    </PageShell>
  );
}
