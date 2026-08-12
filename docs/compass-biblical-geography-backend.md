# Compass Biblical Geography: Backend Contract

This document is the paired backend/admin change set for the member-app branch
`feature/compass-biblical-maps`. The feature is disabled by default and must
never make Scripture reading or normal Compass answers depend on a map provider.

## Feature settings

Create one internally managed settings record with these values:

```ts
type BiblicalMapsSettings = {
  enabled: boolean                 // master member-facing switch
  placeContextEnabled: boolean     // approved text cards can be shown
  interactiveMapsEnabled: boolean  // allows MapTiler style URL to be returned
  maintenanceMessage: string | null
}
```

The existing Compass status endpoint should return:

```json
{
  "enabled": true,
  "geography": {
    "enabled": false,
    "placeContextEnabled": false,
    "interactiveMapsEnabled": false,
    "maintenanceMessage": null
  }
}
```

When `geography.enabled` is false, the member app exposes no geography action.
When it is enabled for a chapter, Compass displays the direct member action:
**Show me the map**.
When only `placeContextEnabled` is true, the API returns approved text cards but
does not return a MapTiler style URL.

## Supabase tables

Use these application-owned tables, all with RLS enabled. Members should only
read published geography through the server route; Super Admin manages drafts
and publishes entries.

```sql
create table biblical_places (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  alternate_names text[] not null default '{}',
  latitude double precision not null,
  longitude double precision not null,
  ancient_region text,
  modern_region text,
  summary text not null,
  historical_notes text,
  status text not null default 'draft'
    check (status in ('draft', 'review', 'published', 'archived')),
  source_citations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table biblical_routes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  era_label text,
  kind text not null default 'story'
    check (kind in ('story', 'comparison')),
  summary text not null,
  coordinates jsonb not null,
  status text not null default 'draft'
    check (status in ('draft', 'review', 'published', 'archived')),
  source_citations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table chapter_geography (
  id uuid primary key default gen_random_uuid(),
  chapter_id bigint not null references bible_chapters(id) on delete cascade,
  place_id uuid references biblical_places(id) on delete cascade,
  route_id uuid references biblical_routes(id) on delete set null,
  is_story_location boolean not null default false,
  display_order integer not null default 0,
  chapter_summary text,
  status text not null default 'draft'
    check (status in ('draft', 'review', 'published', 'archived')),
  unique (chapter_id, place_id, route_id)
);
```

## Member API

`GET /api/app/geography/chapters/:chapterId`

- Requires the same authenticated bearer session as Compass.
- Resolves the existing `<book-slug>-<chapter-number>` chapter identifier.
- Returns only published links and records.
- Returns `404` when no approved geography exists; member app shows no error to
  the user until they intentionally open the action.
- Returns a provider style URL only when both master and interactive switches
  are enabled and the configured MapTiler style URL is valid.

```json
{
  "chapterId": "john-4",
  "summary": "Jesus travels north through Samaria toward Galilee.",
  "bounds": [[34.6, 31.5], [35.4, 32.5]],
  "mapStyleUrl": null,
  "places": [
    {
      "id": "uuid",
      "name": "Sychar",
      "latitude": 32.21,
      "longitude": 35.28,
      "ancientRegion": "Samaria",
      "summary": "A Samaritan town near Jacob's well.",
      "isStoryLocation": true
    }
  ],
  "routes": []
}
```

`routes[].kind` controls presentation only: `story` is the highlighted biblical
movement, while `comparison` is a muted dashed route used to explain a relevant
alternative. The optional `routeComparison` object provides the approved
historical explanation and must not be generated live for members.

```json
{
  "routeComparison": {
    "title": "A direct road with a social boundary",
    "body": "Traveling north through Samaria was the direct route from Judea to Galilee. Many Jewish travelers chose a longer eastern route to avoid Samaritan territory. Jesus' journey through Samaria sets the scene for his conversation at the well."
  }
}
```

## Super Admin

Add a **Biblical Maps** settings panel with the three switches and maintenance
message above. Add review screens for Places, Routes, and Chapter Links. Draft
records must show their research citations and never be visible to members
before publication.

## John pilot

Seed only reviewed entries for John initially: Jordan-region/Bethany beyond the
Jordan, Cana, Capernaum, Jerusalem, Judea, Samaria, Sychar, and the Sea of
Galilee. Link only chapters whose location can be represented responsibly.

### John 4 acceptance example

John 4 is the first route-comparison pilot:

- Highlight Jesus' northbound **direct route through Samaria** from Judea toward
  Galilee.
- Mark Sychar/Jacob's well as the story-location area, with the appropriate
  historical-location confidence noted in the admin record.
- Show a muted **common avoidance route east of the Jordan** only as a
  comparison; do not present it as the route Jesus took.
- Use the approved comparison explanation above. It must say that traveling
  through Samaria was direct, while the common avoidance route was longer.

### Temporary Vercel preview pilot

Until the backend/admin repository is connected and the permanent feature
settings route is deployed, the member branch contains a deliberately limited
preview-only map pilot. It activates only on a `*.vercel.app` hostname, only
for `john-4`, and only when both `VITE_MAPTILER_API_KEY` and
`VITE_MAPTILER_STYLE_ID` are present at build time. It can never activate on a
custom production domain. Remove this fallback as soon as the Super Admin
settings and member geography route are live.

## MapTiler safety

- Keep the MapTiler API key out of source control.
- Restrict any browser-facing key to Project 3|26 production and preview
  domains in MapTiler.
- Do not return a style URL while Interactive Maps is off.
- Provider failure is non-fatal: the API returns text-only place context and
  the member app keeps Scripture and Compass fully usable.

## Copyright, licensing, and attribution

Project 3|26 owns its original geography work: the custom map design, visual
overlays, place summaries, route narratives, chapter curation, and application
code. Use this member-facing notice in the map experience:

> © 2026 Project 3|26. Original biblical map design, place context, and route
> materials are protected. Third-party map and research sources are credited in
> Map Sources & Attribution.

Add a member-accessible **Map Sources & Attribution** page or sheet before
Interactive Maps is enabled. It must list:

- MapTiler and any base-map attribution required by its selected style;
- OpenStreetMap attribution where required by the base data/style;
- every third-party historical boundary dataset, imagery set, or imported
  geographic dataset and its license;
- research citations used for each published place and route.

Do not claim ownership of public geographic facts, modern basemaps, third-party
datasets, or source quotations. Preserve the `source_citations` fields on
places and routes, display them in Super Admin review, and add a new
`map_source_attributions` record type for provider-wide attribution text and
links. No third-party layer can be switched on in Super Admin until its required
attribution record is approved.
