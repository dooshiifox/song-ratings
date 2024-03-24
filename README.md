# Just some favourites list.

Built in about a 6 hours, including rating everything. Fork and make your own ratings if you feel like it I guess. This will automatically read everything in from the `data` folder. The format of each file in the markdown folder is as follows

```md
---
# Name of the game
name: Breath of the Wild

# Optionally, a subtitle for the game.
# I use this as a clarifier (e.g., 'Celeste Mod', 'Including mods')
# or as the series name (e.g., 'The Legend of Zelda', 'Jackbox')
# If you don't need one, just remove the below line
subtitle: The Legend of Zelda

# Anything between 0 and 10 in steps of 0.5, excluding 1.5 and 0.5
# i.e., 10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1, and 0
# are all valid values for this.
rating: 9.5

# Whether you beat the game, `true` or `false`. This is up to you how you define this.
# If you don't need one (e.g. an endless game like Minecraft) you can
# remove the below line
finished: true

# Any additional tags to assist with searching
# Put each tag on a new line, indented and with a `-` at the front
# If you don't need any tags, you can remove the below line
tags:
  - botw
  - zelda
# This whole thing is in YAML format, by the way.
# Copy and paste everything between the `---` into here if you need to validate it
# https://www.yamllint.com/
---

Here, you can put some detailed thoughts in Markdown format. Markdown is kinda like Discord formatting, if you're familiar with that. You can learn Markdown here.
https://www.markdownguide.org/cheat-sheet/https://www.markdownguide.org/cheat-sheet/

By the way, you should probably delete all the files in `src/data` before you start making your own ratings.
```

# Developing

Get `pnpm`, then install all the packages with `pnpm i`. `npm` should work but it's untested. Start the dev server with `pnpm dev` (or `npm run dev`).
