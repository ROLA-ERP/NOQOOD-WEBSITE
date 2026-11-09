# Domain migration and rollback plan (NOT executed; needs explicit approval)

**Target:** `www.noqoodapp.com` → marketing website · `app.noqoodapp.com` → ERP.
**Today:** `www.noqoodapp.com` is the ERP custom domain on Railway. Moving it changes where existing users land, so do it in the order below.

## Migration steps
1. **Prepare the ERP on the new name first** (no impact on current users): in the ERP Railway service add the custom domain `app.noqoodapp.com`; add the CNAME/TXT records Railway shows at the registrar; wait until Railway marks it verified and issues the certificate.
2. Check the ERP works at `https://app.noqoodapp.com` (login, an invoice, a report). Tell users the new address.
3. **Deploy the website service** (see `DEPLOYMENT.md`) and test it on its Railway-generated URL with `SITE_URL`/`ERP_URL` set to the final addresses.
4. **Switch `www`:** remove `www.noqoodapp.com` from the ERP service, add it to the website service, and change the registrar's `www` CNAME/TXT records to the values the website service shows. (Short gap while DNS propagates; do it at a quiet hour.)
5. Verify `https://www.noqoodapp.com` shows the website, the "Login to ERP" button opens `https://app.noqoodapp.com`, `/sitemap.xml` and `/robots.txt` use the final domain.
6. Optional: redirect the bare domain `noqoodapp.com` to `www` at the registrar.

## Rollback (if anything is wrong after step 4)
1. In the registrar, point the `www` records back to the ERP service's values (kept from before the change: **write them down before step 4**).
2. In Railway, remove `www.noqoodapp.com` from the website service and add it back to the ERP service.
3. Users are back on the ERP at `www`; `app.noqoodapp.com` keeps working. The website keeps running on its own URL.

## Risks to check before step 4
* Bookmarks and saved logins at `www.noqoodapp.com` will land on the website: announce `app.noqoodapp.com` first.
* Any link sent to customers pointing at `www` (e.g. the public ordering page) must be updated to `app`.
* The ERP's allowed origins/CORS or e-mail links that contain the old host must be reviewed.
* DNS changes are made by the owner at the registrar; this project does not modify DNS.
