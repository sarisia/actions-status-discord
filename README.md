# Actions Status Discord

[![test](https://github.com/sarisia/actions-status-discord/workflows/test/badge.svg)]()
[![test cancel](https://github.com/sarisia/actions-status-discord/workflows/test%20cancel/badge.svg)]()

## About

A Github Actions action to notify CI status to Discord.

## Usage

```yaml
- name: Post status to Discord
  uses: sarisia/actions-status-discord@v1
  # make sure to set this `always()` 
  # or status failure and cancelled won't be notified!
  if: always()
  with:
    # provide discord webhook via either inputs or env.DISCORD_WEBHOOK
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    status: ${{ job.status }}
    job: deploy to github pages
    description: build pages and deploy to github pages!
    nofail: false
```

<img src="https://user-images.githubusercontent.com/33576079/69472655-332b2880-0df0-11ea-9c33-6add9fca62e9.png" width="500px">

## Environment Variables

| Key | Value | Description |
| - | - | - |
| DISCORD_WEBHOOK | Discord webhook endpoind like:<br>`https://discordapp.com/api/webhooks/...` | You can provide webhook via inputs either.

## Inputs

| Key | Required | Value | Default | Description |
| - | - | - | - | - |
| webhook | No | String | `env.DISCORD_WEBHOOK` | Discord webhook endpoind like:<br>`https://discordapp.com/api/webhooks/...`<br>You can provide webhook via env either. If both is set, this input will be used.<br>**DO NOT INCLUDE `/github` SUFFIX!** |
| status | No | `Success`, `Failure` or `Cancelled` | `Success` | Set to `${{ job.status }}` is recommended. |
| description | No | String | | Description included in message. See example above. |
| job | no | String | | Job name included in message title. See example above. |
| nofail | no | `true` or `false` | `true` | This action won't make workflow failed by default. If set to `false`, this action will set status failed when failed to notify. |
