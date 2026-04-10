---
name: "YouTube Thumbnail Generator"
slug: "youtube-thumbnail-generator"
description: "Generate high-converting YouTube thumbnails via OpenRouter (Google Nano Banana) — composition rules, A/B variants, and prompt formulas that work."
tab: "personal"
domain: "content-creation"
industry_vertical: null
difficulty: "intermediate"
source_type: "ragnar-custom"
tags: ["youtube", "thumbnail", "openrouter", "image-generation", "nano-banana", "content"]
version: "1.0.1"
icon_emoji: "🖼️"
is_coming_soon: false
is_featured: true
author: "ragnar"
learning_path: null
learning_path_position: null
prerequisites: ["youtube-script"]
references:
  - title: "OpenRouter API Documentation"
    url: "https://openrouter.ai/docs"
  - title: "Google Nano Banana (Imagen 3) via OpenRouter"
    url: "https://openrouter.ai/google/imagen-3"
  - title: "YouTube Creator Academy — Thumbnails"
    url: "https://creatoracademy.youtube.com"
requires: "OpenRouter API Key"
mcp_tools:
  - "openrouter"
  - "generate-image-open"
---

# YouTube Thumbnail Generator

A great thumbnail is the difference between 2% and 8% click-through rate on the same video. That's a 4x difference in views — from the same content, same SEO, same audience. This skill generates thumbnails using OpenRouter (Google Nano Banana / Imagen 3) with composition formulas proven to work.

## Why OpenRouter + Nano Banana

**Google Nano Banana (Imagen 3)** via OpenRouter produces photorealistic thumbnails with:
- Precise text rendering (rare in image AI — most models butcher text)
- Clean backgrounds without the typical AI noise artifacts
- Strong face rendering if you're using a headshot

**OpenRouter** gives you:
- Unified API for Nano Banana, FLUX, DALL-E 3, Ideogram — one key, all models
- Pay-per-use with no subscription required
- Easy A/B testing across models with the same prompt

**Claude Code integration:** Use the `generate-image-open` or `nano-banana-image` skill in Claude Code, which calls OpenRouter automatically. No manual API setup needed in a Claude Code session.

## Trigger Phrases

- "Generate a YouTube thumbnail for [topic]"
- "Create thumbnail for my video about [subject]"
- "Make a YouTube thumbnail using Nano Banana"
- "Design A/B thumbnail variants for [video title]"
- "Thumbnail with OpenRouter for [topic]"

## Thumbnail Composition Rules

### The Big Three Elements
Every high-performing thumbnail has exactly these elements in the right proportions:

1. **Face or focal object** (40-60% of frame) — large, emotional, looking at the camera or toward the text
2. **Bold text** (2-4 words max, 1/3 of frame) — the promise or curiosity gap
3. **Clean background** — one or two contrasting colors, no busy patterns

### Dimension and Technical Specs
```
Resolution: 1280 × 720 pixels (16:9)
File format: JPG or PNG
File size: Under 2MB
Safe zone: Keep key elements 50px from edges (mobile crop)
Text contrast: Minimum 4.5:1 contrast ratio against background
```

### Color Psychology
| Goal | Color Palette |
|---|---|
| Authority / Trust | Navy blue + white + gold |
| Energy / Urgency | Red + yellow + black |
| Technology / Innovation | Deep purple + cyan + white |
| Money / Success | Green + gold + black |
| Warning / Controversy | Red + white (high contrast) |

## OData Queries (for D365-integrated content)
*Not applicable — this skill uses OpenRouter image generation API, not D365 OData.*

## Prompt Formulas

### Formula 1: Face + Text (Personal Brand)
```
Professional headshot of [description] looking directly at camera with 
[emotion: surprised/excited/serious] expression. Bold text overlay on 
the right side reads "[2-4 word hook]". Background: [color] gradient. 
Lighting: dramatic studio lighting with rim light. 
Style: Professional YouTube thumbnail, high contrast, no AI artifacts.
1280x720 pixels. photorealistic.
```

**Example:**
```
Professional headshot of a confident South Asian man in his 30s in a 
dark blazer, looking directly at camera with a slightly surprised expression. 
Bold white text overlay on right side reads "THIS CHANGES EVERYTHING". 
Background: deep navy blue to black gradient. 
Lighting: dramatic studio lighting with cyan rim light.
Style: Professional YouTube thumbnail, high contrast, no AI artifacts.
1280x720 pixels, photorealistic.
```

### Formula 2: Concept Visualization (No Face)
```
[Dramatic scene or concept visualization]. No people. 
Bold text in [color] reads "[hook text]" centered at bottom.
Style: Cinematic, high contrast, professional YouTube thumbnail.
Background: [color/environment].
1280x720 pixels.
```

**Example:**
```
A glowing digital network connecting floating enterprise buildings and 
data centers, viewed from above, with golden light paths between nodes.
Bold white text reads "AI CHANGED MY COMPANY" centered at bottom.
Style: Cinematic, high contrast, professional YouTube thumbnail.
Background: Deep space with blue/purple nebula.
1280x720 pixels.
```

### Formula 3: Before/After Split
```
Split screen image: left half shows [before state - dark/negative], 
right half shows [after state - bright/positive]. 
Bold text in center reads "vs" or "[topic]". 
Style: YouTube thumbnail, clear split, high contrast.
1280x720 pixels.
```

## A/B Testing Strategy

Generate 3 variants for every video:

| Variant | Change | Tests |
|---|---|---|
| A | Face + emotional expression | Curiosity gap text |
| B | Same face, different text | Direct benefit text |
| C | Concept visual, no face | Text-only hook |

**Rule:** Run for 48 hours minimum before picking winner. Don't trust the first 2 hours — thumbnail CTR stabilizes after the initial impression burst.

**Winner selection:** Choose the thumbnail with the highest click-through rate (CTR) in YouTube Analytics → Reach → Impressions click-through rate.

## Claude Code Usage

In a Claude Code session, trigger thumbnail generation:

```
/generate-image-open Create a YouTube thumbnail for a video about "Why D365 agents 
will replace half your ERP consultants by 2027". 
Use Formula 1 with Ragnar's confident expression, navy/gold color palette, 
text reads "REPLACE YOUR CONSULTANTS". Generate 3 A/B variants.
```

Or use the `nano-banana-image` skill for Google Imagen 3 specifically:
```
/nano-banana-image YouTube thumbnail 1280x720: [your prompt here]
```

## Common Scenarios

### Scenario 1: Tech Explainer Video
**Video title:** "What is MCP and Why Your IT Team Needs 6 Weeks to Build It"
**Thumbnail approach:** Face variant (confused/surprising expression) + "6 WEEKS?!" text + blueprint/circuit board background
**Prompt:** `[Formula 1 with surprised expression, text: "6 WEEKS?!", background: dark blueprint engineering drawing with glowing circuit lines]`

### Scenario 2: Thought Leadership Video
**Video title:** "The Death of the Traditional ERP Consultant"
**Thumbnail approach:** Concept visual (dramatic) + bold text
**Prompt:** `[Formula 2: old computer being replaced by glowing AI orb, text: "ERP IS DEAD"]`

### Scenario 3: Tutorial Video
**Video title:** "Build Your First Copilot Studio Agent in 30 Minutes"
**Thumbnail approach:** Split before/after + timer element
**Prompt:** `[Formula 3: left shows empty chat interface (dark), right shows working agent interface (bright), center text: "30 MIN BUILD"]`

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Text renders incorrectly | AI image models struggle with text | Use Ideogram via OpenRouter instead — best text rendering of any model |
| Face looks uncanny | Photorealism prompt missing | Add "photorealistic, DSLR quality, 85mm lens" to prompt |
| Too much noise/artifacts | Generic style prompt | Add "clean, professional, no artifacts, studio quality" |
| Low CTR despite good image | Text promise doesn't match video | Align thumbnail text with the video's opening hook |
| Colors look washed out | No contrast specification | Add "high contrast, vibrant colors, rich blacks" to prompt |

## MCP / Tool Comparison for Thumbnails

| Tool | Best For | Quality | Speed | Cost |
|---|---|---|---|---|
| **OpenRouter + Nano Banana** | Photorealistic faces, clean backgrounds | ⭐⭐⭐⭐⭐ | Fast | ~$0.04/image |
| **OpenRouter + Ideogram** | Text rendering, typography | ⭐⭐⭐⭐⭐ | Medium | ~$0.06/image |
| **OpenRouter + FLUX Dev** | Artistic/stylized | ⭐⭐⭐⭐ | Fast | ~$0.03/image |
| **fal.ai MCP** | Batch generation, video | ⭐⭐⭐⭐ | Very fast | Similar to above |
| **Figma MCP** | Template-based, brand consistent | ⭐⭐⭐ | Requires template | Figma subscription |

**Recommendation:** Use **Ideogram** (via OpenRouter) if your thumbnail has text that must be readable. Use **Nano Banana** for face-forward thumbnails or concept visuals without text.

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.0.1 | 2026-04-10 | Added MCP tool comparison, Figma alternative, full prompt formulas, A/B testing strategy |
| 1.0.0 | 2026-04-09 | Initial skill definition |
