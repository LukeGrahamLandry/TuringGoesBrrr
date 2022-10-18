# Adventures with Cloudflare

## Build Script Fixes 

- Use `printf` instead of `echo` because it was escaping the line breaks in my license headers. 
- Install nim if it's missing (which they will be on CloudFlare's fresh image).
- Couldn't figure out how to pass options when piping `curl choosenim` directly to bash. Instead, save it to a file, `chmod` it to be executable, and run passing `-y` to accept defaults. 
- Create a `requirements.txt` file for the python scripts.

After those changes it worked perfectly just pointing it at my github repo. 

## Environment Variables 

For secrets that I don't want to commit to the repo (like API keys), cloudflare lets you set environment variables for when the build script is run. These are just generic unix variables so they can be set locally with `NAME=value && export NAME` and read with `echo $NAME`. Python scripts can access them with `os.environ["NAME"]`.

This is also how you set some versions for dependencies you want installed when cloudflare builds the site. For example, I use `PYTHON_VERSION=3.7`. [CF Docs: List of environment variables to set tool versions](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables).

## Generating List of Past Versions 

October 12

Each time you deploy a site with Cloudflare pages, it gets a unique `hash.project_name.pages.dev` url. Each time you update the site, your custom domains get set to point to the newer deployment but the old one stays active at it's unique url. They have an api ([docs](https://api.cloudflare.com/#pages-deployment-get-deployments)) that lets you fetch a list of a project's past deployments. I'm using this to generate a page with a table of links to all the past versions so people can access features removed or broken by new versions. I'm not sure how cloudflare keeps these available but I have one from August 2021 thats still available in October 2022. 

Adding some environment variables for the secrets needed by the api. [Create cloudflare API token](https://dash.cloudflare.com/profile/api-tokens) with the permission (Account - Cloudflare Pages - Read). When you select your site in the pages dashboard, the url is in the format `https://dash.cloudflare.com/CLOUDFLARE_ACCOUNT_ID/pages/view/CLOUDFLARE_PAGES_PROJECT_NAME`

- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_PAGES_PROJECT_NAME
- CLOUDFLARE_ACCOUNT_ID

The API documentation still uses examples of authenticating with an api key and email address instead of an api token but that's depreciated since you can't limit the scope of the key. You can generate lots of different tokens with different scopes they can access.  