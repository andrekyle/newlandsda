import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import {
  EditableText,
  EditableList,
  ListField,
  ListTextarea,
  ListImage,
} from "@/components/Editable";
import { ArrowLeft, ArrowRight, Users, Clock, MapPin, Calendar, HeartHandshake, Image as ImageIcon } from "lucide-react";
import { getMinistry } from "@/data/ministries";
import { getMinistryDetail } from "@/data/ministries-detail";
import type {
  MinistryTeamMember,
  MinistryEvent,
  MinistryFundraiser,
} from "@/data/ministries-detail";

export const Route = createFileRoute("/ministries_/$ministryId")({
  component: MinistryDetail,
  loader: ({ params }) => ({
    ministryId: params.ministryId,
    ministry: getMinistry(params.ministryId) ?? null,
  }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.ministry?.title ?? "Ministry"} — Newlands SDA Church`,
      },
      {
        name: "description",
        content: loaderData?.ministry?.short ?? "",
      },
    ],
  }),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">{error.message}</p>
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="mt-6 bg-primary text-primary-foreground px-5 py-2.5 font-medium rounded-none text-sm hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      </PageShell>
    );
  },
});

function MinistryDetail() {
  const { ministry } = Route.useLoaderData();

  if (!ministry) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Ministry not found</h1>
          <p className="mt-3 text-muted-foreground">
            We couldn't find that ministry.
          </p>
          <Link
            to="/ministries"
            className="mt-6 inline-block text-primary font-medium hover:opacity-80 transition-opacity"
          >
            &larr; All ministries
          </Link>
        </div>
      </PageShell>
    );
  }

  const m = ministry;
  const Icon = m.icon;
  const detail = getMinistryDetail(m.id) ?? { team: [], events: [], fundraising: [] };

  return (
    <PageShell>
      {/* Image-only hero banner — admin uploads the designed banner art
          for this ministry. Same id as before so existing uploads persist. */}
      <PageHero
        title={m.title}
        image={m.bannerImage}
        imageId={`pagehero.ministry.${m.id}.image`}
        overlay={false}
      />

      {/* Title block + back link sit below the banner so they don't
          overlap the designed art. */}
      <section className="bg-card border-b border-border/50">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Link
            to="/ministries"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> All Ministries
          </Link>
          <div className="flex items-start gap-5">
            <div
              className={`hidden sm:flex h-16 w-16 rounded-sm bg-linear-to-br ${m.gradient} items-center justify-center shrink-0`}
            >
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                <EditableText id={`ministries.${m.id}.title`} defaultValue={m.title} as="span" />
              </h1>
              <p className="mt-2 text-base md:text-lg text-muted-foreground italic">
                <EditableText
                  id={`ministries.${m.id}.tagline`}
                  defaultValue={m.tagline}
                  as="span"
                  multiline
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-5xl px-4 py-16 grid gap-12 md:grid-cols-3">
        <div className="md:col-span-2 space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight">About this ministry</h2>
          {m.description.map((p, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed">
              <EditableText
                id={`ministries.${m.id}.description.${i}`}
                defaultValue={p}
                as="span"
                multiline
              />
            </p>
          ))}

          <div className="mt-8">
            <h3 className="text-xl font-semibold tracking-tight mb-4">What we do</h3>
            <ul className="space-y-3">
              {m.activities.map((a, idx) => (
                <li key={idx} className="flex gap-3 text-muted-foreground">
                  <span className="text-primary mt-1 shrink-0" aria-hidden>
                    &#9679;
                  </span>
                  <span className="flex-1">
                    <EditableText
                      id={`ministries.${m.id}.activity.${idx}`}
                      defaultValue={a}
                      as="span"
                      multiline
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-card border border-border/50 p-6 rounded-sm">
            <h3 className="text-lg font-semibold tracking-tight mb-4">At a glance</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground flex-1">
                  Led by{" "}
                  <EditableText
                    id={`ministries.${m.id}.leader`}
                    defaultValue={m.leader}
                    className="text-foreground font-medium"
                  />
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="flex-1">
                  <EditableText
                    id={`ministries.${m.id}.meets`}
                    defaultValue={m.meets}
                    className="text-muted-foreground"
                  />
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="flex-1">
                  <EditableText
                    id={`ministries.${m.id}.location`}
                    defaultValue={m.location}
                    className="text-muted-foreground"
                  />
                </span>
              </div>
            </dl>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            >
              Get involved <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </section>

      {/* Leadership team */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Leadership team</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Meet the people serving in this ministry. In edit mode you can update each
            profile or add new team members.
          </p>
          <EditableList<MinistryTeamMember>
            id={`ministries.${m.id}.team`}
            defaultValue={detail.team}
            newItem={() => ({
              name: "New member",
              role: "Role",
              bio: "Short bio.",
              image: "",
            })}
            addLabel="Add team member"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            itemClassName="bg-card border border-border/50 rounded-sm overflow-hidden flex flex-col"
            renderItem={(item, { update, editMode, index }) => (
              <>
                <ListImage
                  value={item.image}
                  onChange={(v) => update({ image: v })}
                  editMode={editMode}
                  alt={item.name}
                  className="aspect-4/5 w-full"
                  uploadId={`ministries.${m.id}.team.${index}.image`}
                />
                <div className="p-5 flex-1 flex flex-col gap-2">
                  <ListField
                    value={item.name}
                    onChange={(v) => update({ name: v })}
                    editMode={editMode}
                    className="text-lg font-semibold tracking-tight"
                    placeholder="Full name"
                  />
                  <ListField
                    value={item.role}
                    onChange={(v) => update({ role: v })}
                    editMode={editMode}
                    className="text-sm text-primary font-medium"
                    placeholder="Role"
                  />
                  <ListTextarea
                    value={item.bio}
                    onChange={(v) => update({ bio: v })}
                    editMode={editMode}
                    className="text-sm text-muted-foreground leading-relaxed"
                    placeholder="Short bio"
                  />
                </div>
              </>
            )}
          />
        </div>
      </section>

      {/* Upcoming events */}
      <section className="bg-card border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Upcoming events</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Mark your calendar for our regular gatherings and special events.
          </p>
          <EditableList<MinistryEvent>
            id={`ministries.${m.id}.events`}
            defaultValue={detail.events}
            newItem={() => ({
              name: "New event",
              date: "TBD",
              description: "What this event is about.",
            })}
            addLabel="Add event"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            itemClassName="bg-background border border-border/50 rounded-sm p-5 flex flex-col gap-2"
            renderItem={(item, { update, editMode }) => (
              <>
                <ListField
                  value={item.name}
                  onChange={(v) => update({ name: v })}
                  editMode={editMode}
                  className="text-lg font-semibold tracking-tight"
                  placeholder="Event title"
                />
                <ListField
                  value={item.date}
                  onChange={(v) => update({ date: v })}
                  editMode={editMode}
                  className="text-sm text-primary font-medium"
                  placeholder="Date / frequency"
                />
                <ListTextarea
                  value={item.description}
                  onChange={(v) => update({ description: v })}
                  editMode={editMode}
                  className="text-sm text-muted-foreground leading-relaxed"
                  placeholder="Description"
                />
              </>
            )}
          />
        </div>
      </section>

      {/* Fundraising */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center gap-3 mb-2">
            <HeartHandshake className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Fundraising &amp; giving</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Partner with this ministry through prayer and giving. Every contribution
            advances our shared mission.
          </p>
          <EditableList<MinistryFundraiser>
            id={`ministries.${m.id}.fundraising`}
            defaultValue={detail.fundraising}
            newItem={() => ({
              title: "New project",
              description: "What the gift supports.",
              goal: "",
            })}
            addLabel="Add fundraiser"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            itemClassName="bg-card border border-border/50 rounded-sm p-5 flex flex-col gap-2"
            renderItem={(item, { update, editMode }) => (
              <>
                <ListField
                  value={item.title}
                  onChange={(v) => update({ title: v })}
                  editMode={editMode}
                  className="text-lg font-semibold tracking-tight"
                  placeholder="Project title"
                />
                {(editMode || item.goal) && (
                  <ListField
                    value={item.goal}
                    onChange={(v) => update({ goal: v })}
                    editMode={editMode}
                    className="text-sm text-primary font-medium"
                    placeholder="Goal (optional)"
                  />
                )}
                <ListTextarea
                  value={item.description}
                  onChange={(v) => update({ description: v })}
                  editMode={editMode}
                  className="text-sm text-muted-foreground leading-relaxed"
                  placeholder="Description"
                />
              </>
            )}
          />
          <div className="mt-10">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 font-medium rounded-none text-sm hover:opacity-90 transition-opacity"
            >
              Give to this ministry <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Activity gallery */}
      <section className="bg-card border-t border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Activity gallery</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Photos from this ministry&rsquo;s recent activities. In edit mode you can
            upload new photos and add captions.
          </p>
          <EditableList<{ image: string; caption: string }>
            id={`ministries.${m.id}.gallery`}
            defaultValue={[]}
            newItem={() => ({ image: "", caption: "" })}
            addLabel="Add photo"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            itemClassName="bg-background border border-border/50 rounded-sm overflow-hidden flex flex-col"
            renderItem={(item, { update, editMode, index }) => (
              <>
                <ListImage
                  value={item.image}
                  onChange={(v) => update({ image: v })}
                  editMode={editMode}
                  alt={item.caption || "Ministry activity"}
                  className="aspect-video w-full"
                  uploadId={`ministries.${m.id}.gallery.${index}.image`}
                />
                {(editMode || item.caption) && (
                  <div className="p-4">
                    <ListField
                      value={item.caption}
                      onChange={(v) => update({ caption: v })}
                      editMode={editMode}
                      className="text-sm text-muted-foreground"
                      placeholder="Caption (optional)"
                    />
                  </div>
                )}
              </>
            )}
          />
        </div>
      </section>
    </PageShell>
  );
}
