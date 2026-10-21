# Build Tala without running Blender on your laptop

Open **Actions → Build Tala art in the cloud → Run workflow** in this repository. Use `main` or the branch containing the art changes. Leave **Rebuild the face atlas** enabled after editing face geometry, UVs, source painting or mask; disable it only for body/hair changes with an unchanged face. Leave **Render review images** enabled to inspect the result.

The workflow uses GitHub's Linux runner and Blender 3.6.22, downloaded from Blender's official FTP mirror and checked against its published SHA-256. It builds the GLB and editable `.blend`, runs the game tests against the newly built asset, samples current game poses and optionally renders the head, guard, full body and three punch contact poses.

After a successful run, download its `tala-design02-N` artifact. It contains the rebuilt model, packed Blender source, face atlas, pose data, build report and requested review images. `cloud-build.json` records the source commit, run URL, options and output checksums. If renders were skipped, previous images are excluded. Artifacts expire after 14 days; committed source files remain available to reproduce them.

A cloud build does **not** change the live game. Inspect the renders, then bring the chosen outputs into a branch, update the model cache revision, run the tests and commit/push through the normal Pages workflow. This keeps an unreviewed or old-branch rebuild from replacing the public game.

CLI equivalent:

```
gh workflow run tala-art.yml --ref main -f rebake_face=true -f render_review=true
gh run list --workflow tala-art.yml
```

No Blender installation or API key is required on the laptop. Downloading the artifact is optional; the workflow runs entirely on GitHub. GitHub's account-specific Actions/storage limits still apply.

Official release/checksum source: https://ftp.blender.org/release/Blender3.6/blender-3.6.22.sha256
