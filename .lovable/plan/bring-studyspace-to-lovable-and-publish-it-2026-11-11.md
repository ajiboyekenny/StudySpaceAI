# Bring StudySpace to Lovable and publish it

## What will change
- Recreate the uploaded StudySpace experience as the app’s first screen, including its learning catalog, study tools, progress views, offline library and account flow.
- Replace the source project’s sign-in and saved-progress service with Lovable Cloud, preserving the inspected table structure and user-only access rules.
- Carry over the bundled images and app assets; do not reuse any source secrets.
- Publish the finished app and share its live link. GitHub linking remains available through Project settings → Git if desired.

## Data and verification
- No old account list or saved-study records were included. Build the working app and schema without those records, then request exports after the preview.
- Verify the public study experience and available account flow. Existing-user transfer remains pending until the user export is provided and first-login setup is checked.

## Technical details
- Port the React/Vite source into the existing TanStack Start structure and preserve its pinned TanStack dependencies.
- Enable Lovable Cloud, recreate the inspected schema, row-level access policies and initial weekly challenge seed, then verify the published preview before deployment.
