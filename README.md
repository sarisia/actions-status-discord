# Actions Status Discord

Post GitHub Actions status to Discord as an beautiful embed

![image](https://user-images.githubusercontent.com/33576079/102154007-d6e3ec80-3ebb-11eb-9389-f372954813c5.png)

- :sushi: **_Zero-configuration!_** Works perfectly out of the box.
- :sushi: **_Universal!_** Supports Linux (Ubuntu), macOS and Windows runners.
- :sushi: **_Fast startup!_** Faster than ones written as Docker container action.

---

> :warning: If you're reading this document in master branch,
> please refer to the [latest released document here](https://github.com/marketplace/actions/actions-status-discord). 

## Usage

### Minimum

```yaml
- uses: sarisia/actions-status-discord@v1
  if: always()
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
```

![image](https://user-images.githubusercontent.com/33576079/102154007-d6e3ec80-3ebb-11eb-9389-f372954813c5.png)

### Full options

```yaml
- uses: sarisia/actions-status-discord@v1
  if: always()
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    title: "deploy"
    description: "Build and deploy to GitHub Pages"
    image: ${{ secrets.EMBED_IMAGE }}
    color: 0x0000ff
    username: GitHub Actions
    avatar_url: ${{ secrets.AVATAR_URL }}
```

![image](https://user-images.githubusercontent.com/33576079/102154036-ecf1ad00-3ebb-11eb-9af3-ff58982d9ecb.png)

### No detail

```yaml
- uses: sarisia/actions-status-discord@v1
  if: always()
  env:
    DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
  with:
    nodetail: true
    title: "We did it!"
    color: 0xff91a4
```

![image](https://user-images.githubusercontent.com/33576079/102154072-009d1380-3ebc-11eb-9fe9-24d35a0e1e7b.png)

For `if` parameter, see
[GitHub Actions Reference](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#job-status-check-functions)

## Configuration

### Environment Variables

| Key | Value | Description |
| - | - | - |
| DISCORD_WEBHOOK | Discord webhook endpoind like:<br>`https://discordapp.com/api/webhooks/...` | You can provide webhook via inputs either.<br>**DO NOT APPEND [`/github` SUFFIX](https://discord.com/developers/docs/resources/webhook#execute-githubcompatible-webhook)!**

### Inputs

#### General customizations

| Key | Required | Value | Default | Description |
| - | - | - | - | - |
| webhook | No | String | `env.DISCORD_WEBHOOK` | Discord webhook endpoind like:<br>`https://discordapp.com/api/webhooks/...`<br>This overrides `env.DISCORD_WEBHOOK`.<br>**DO NOT APPEND [`/github` SUFFIX](https://discord.com/developers/docs/resources/webhook#execute-githubcompatible-webhook)!** |
| status | No | `Success`, `Failure` or `Cancelled` | `${{ job.status }}` | See [Document for `job` context](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#job-context) |
| content | No | String | | Content. Shown as an message outside of the embed. See [Mention to user/role](#mention-to-user/role) |
| title | No | String | `${{ github.workflow}}` | String included in embed title. Overrides `job` input. |
| description | No | String | | Description included in message |
| image | No | String | | Image attached to the message |
| color | No | Hex string like: `0xFFFFFF` | | Overrides Discord embed color |
| url | No | String | | URL to jump when the title is clicked |
| username | No | String | | Overrides Discord webhook username |
| avatar_url | No | String | | Overrides Discord webhook avatar url |

#### Advanced usages

| Key | Required | Value | Default | Description |
| - | - | - | - | - |
| nofail | No | `true` or `false` | `true` | This action won't make workflow failed by default. If set to `false`, this action will set status failed when failed to notify. |
| nocontext | No | `true` or `false` | `false` | Set `true` to suppress GitHub context fields (`Repository`, `Ref`, etc). |
| noprefix | No | `true` or `false` | `false` | Set `true` to avoid appending job status (`Success: `, etc.) to title |
| nodetail | No | `true` or `false` | `false` | Set `true` will set both `nocontext` and `noprefix` to `true` |
| notimestamp | No | `true` or `false` | `false` | Set `true` to avoid appending timestamp |


<details>
<summary>Show deprecated</summary>

| Key | Required | Value | Default | Description |
| - | - | - | - | - |
| job | No | String | | **Deprecated. Will be removed in v2**<br>Job name included in message title. Same as `title` input. |

</details>

<!-- ## Migrate to v2

### input `job` is now `title`

`job` input is deprecated and now removed in v2.

Just change `job` to `title` in your workflow file to make it work. -->

## Tips

### Using markdown

Some fields support markdown syntax.

```yaml
- uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    nodetail: true
    title: New version of `software` is ready!
    description: |
      Version `1.2.3-alpha`
      Click [here](https://github.com/sarisia/actions-status-discord) to download!
```

![image](https://user-images.githubusercontent.com/33576079/102154106-0f83c600-3ebc-11eb-9b4e-b8a90afae4db.png)

### Mention to user/role

Since `@mention` inside the embed does not generate ping to users,
you can use `content` input to mention users/roles:

```yaml
- uses: sarisia/actions-status-discord@v1
  if: always()
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    content: "Hey <@316911818725392384>"
```

See the [Discord Developer Docs](https://discord.com/developers/docs/reference#message-formatting) for available formats.

### Trigger multiple webhooks

You can set multiple webhooks separated with EOL (line break, `\n`) to Secrets.

For example, set Secrets to:
```
https://discordapp.com/api/webhooks/...
https://media.guilded.gg/webhooks/...
https://this-is-invalid-webhook-endpoint.invalid/...
```
will trigger these 3 webhooks simultaneously.

If some of these webhooks are failed, other deliveries will **NOT** be cancelled.

If the option `nofail` is set to `false` and any of one fail, the action will set
workflow status to `Failure`.

### Guilded webhook support

As [Guilded](https://guilded.gg) supports [Discord Webhooks API](https://discord.com/developers/docs/resources/webhook#execute-webhook),
you can use Guilded webhook endpoint in the same way as Discord webhook.

## FAQ

### `Error: Webhook response: 400: {"sender":["This field is required"]}`

Do not append `/github` suffix to your webhook URL. See [Inputs](#inputs) section.

## Questions? Bugs?

Feel free to ask in [Discussions](https://github.com/sarisia/actions-status-discord/discussions),
or report bugs in [Issues](https://github.com/sarisia/actions-status-discord/issues)!
