---
name: "image-prompt-generator"
slug: "image-prompt-generator"
description: "Generates optimized prompts for AI image tools including Midjourney, DALL-E, Stable Diffusion, and fal.ai. Covers technical diagrams, LinkedIn featured images, YouTube thumbnails, and infographics. Use when user says 'image prompt', 'generate an image', 'create a visual', 'thumbnail prompt', 'diagram prompt', 'LinkedIn image'."
tab: "personal"
domain: "content-creation"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["intermediate", "content", "image-prompts", "ai-images"]
version: "1.1.0"
icon_emoji: "⚡"
is_coming_soon: false
is_featured: false
author: "Ragnar Pitla | skill.rbuild.ai"
learning_path: null
learning_path_position: null
prerequisites: []
references: []
requires: "fal.ai MCP or OpenRouter"
mcp_tools: []
---


# Image Prompt Generator

Generate precise prompts for AI image tools. Covers the full range: technical architecture diagrams, LinkedIn featured images, YouTube thumbnails, social infographics, and presentation visuals.

## Trigger Phrases

- "image prompt for"
- "generate an image of"
- "create a visual for"
- "thumbnail prompt"
- "diagram prompt"
- "LinkedIn featured image"
- "infographic prompt"
- "create a thumbnail idea"

## Model Selection

Different tools have different strengths. Match the tool to the use case.

| Use Case | Best Model | Via |
|---|---|---|
| Photorealistic faces / thumbnails | Google Imagen 3 (Nano Banana) | OpenRouter or fal.ai |
| Text legibility in images | Ideogram v2 | OpenRouter or fal.ai |
| Artistic / illustrated style | FLUX Dev or Midjourney | fal.ai or direct |
| Technical diagrams | DALL-E 3 | OpenRouter |
| Logo-style / vector-look | Stable Diffusion XL | fal.ai |

**In Claude Code:** Use `/generate-image-open` (OpenRouter/Nano Banana) or the `fal-ai-media` skill for direct fal.ai access.

## Prompt Anatomy

Every good prompt has these components in order:

```
[Subject] + [Context/Setting] + [Style] + [Lighting] + [Composition] + [Technical specs]
```

**Example:**
```
A glowing neural network diagram overlaid on a corporate building,
representing enterprise AI integration.
Style: clean infographic, Microsoft design language, deep blue and white.
Lighting: soft diffused light, no harsh shadows.
Composition: centered, plenty of negative space.
16:9 aspect ratio, 1920x1080, professional presentation quality.
```

## Prompt Templates by Content Type

### YouTube Thumbnail (with face)
```
Professional headshot of [description of person] looking directly at camera 
with [emotion: surprised/confident/serious] expression.
Bold [color] text on [left/right] side reads "[2-4 word hook text]".
Background: [color] gradient, minimal, no clutter.
Lighting: dramatic studio lighting with [color] rim light.
Style: professional YouTube thumbnail, high contrast, photorealistic, no AI artifacts.
1280x720 pixels.
```

### YouTube Thumbnail (concept, no face)
```
[Dramatic visual concept, described in one sentence].
No people. Bold white text reads "[hook text]" at bottom third.
Style: cinematic, high contrast, professional YouTube thumbnail.
Color palette: [e.g., deep space blues with gold light accents].
1280x720 pixels.
```

### LinkedIn Featured Image
```
Clean, professional illustration of [concept].
Style: Microsoft design language, flat with depth, corporate but modern.
Color palette: [deep blue / teal / white] or [match brand palette].
Text overlay: "[optional headline]" in bold sans-serif.
16:9 aspect ratio, 1200x627 pixels.
No stock photo clichés (no handshakes, no puzzle pieces, no light bulbs).
```

### Technical Architecture Diagram
```
Clean technical architecture diagram showing [system overview].
Components: [list the boxes/nodes: Agent, Dataverse, D365 F&O, Power Automate, etc.]
Connections: [describe the flows with arrows]
Style: flat, clean lines, Microsoft Fluent Design, white background.
Color coding: [e.g., blue = agents, green = data, orange = actions]
No decorative elements. Labels on every component. 1920x1080.
```

### Infographic / Social Graphic
```
Clean infographic titled "[title]".
Content layout: [describe sections, e.g., "3 columns with icons and short text below each"]
Icons: [style: flat, outline, filled]
Background: [solid color / subtle gradient]
Typography: bold header, clean body text.
Color palette: [2-3 colors].
Style: professional, modern, suitable for LinkedIn sharing.
1080x1080 pixels (square) or 1200x627 (landscape).
```

### Presentation Slide Background
```
Abstract [theme: technology / enterprise / AI / data flow] background image.
Subtle and non-distracting. Will have text overlaid.
Style: dark with subtle light patterns, or clean light with minimal geometry.
Color: [align with presentation theme].
No text. No faces. No recognizable logos.
16:9, 1920x1080.
```

## Style References

**Microsoft / Enterprise look:** "Microsoft design language, Fluent Design, clean geometry, blues and whites, professional"

**Futuristic / AI feel:** "Cyberpunk-adjacent but corporate, neon on dark, neural network visualizations, holographic"

**Minimalist / Clean:** "Flat design, lots of negative space, 2-3 color palette, editorial illustration style"

**Cinematic / YouTube:** "Dramatic lighting, high contrast, rich blacks, vivid accent colors, photorealistic"

## Aspect Ratios Quick Reference

| Format | Ratio | Pixels |
|---|---|---|
| YouTube thumbnail | 16:9 | 1280x720 |
| LinkedIn post image | 1.91:1 | 1200x627 |
| LinkedIn article cover | 1.91:1 | 1200x627 |
| Instagram square | 1:1 | 1080x1080 |
| Twitter/X image | 16:9 | 1200x675 |
| Presentation slide | 16:9 | 1920x1080 |

## What to Avoid

- "A professional businessman shaking hands" (stock photo cliché)
- "Puzzle pieces coming together" (overused metaphor)
- "Light bulb" for ideas (very dated)
- Cluttered backgrounds for thumbnail overlays
- Generic "blue abstract" without specifics
- Requesting text in images with models that aren't Ideogram (they'll render it wrong)

## Quick Example

> See `image-prompt-generator-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Text in image is garbled or misspelled | Model doesn't handle text rendering well | Switch to Ideogram v2 via OpenRouter for any image requiring readable text |
| Image looks generic or stock-photo-like | Prompt lacks specific style direction | Add explicit style references: "no stock photo clichés", specify color palette, composition |
| Face looks uncanny | Missing photorealism qualifiers | Add "photorealistic, DSLR quality, 85mm portrait lens, natural skin texture" |
| Wrong aspect ratio | Forgot to specify dimensions | Always include pixel dimensions and aspect ratio in every prompt |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
