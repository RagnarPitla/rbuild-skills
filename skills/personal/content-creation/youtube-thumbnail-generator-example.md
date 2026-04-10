# YouTube Thumbnail Generator — Example

## Scenario: Going from 1.8% to 6.4% CTR on the Same Video

**Who:** Ragnar Pitla, YouTube creator @RagnarPitla, enterprise AI content
**Where:** YouTube Studio + Claude Code with OpenRouter
**The Problem:** Ragnar uploaded a video about the Niyam pattern — deep, valuable content. It got 1.8% click-through rate in the first 48 hours, which meant YouTube's algorithm wasn't promoting it. The content was strong but the thumbnail was a screenshot from the Copilot Studio interface with text added in Canva. Professional-looking, but not clickable.

**Prerequisites:** OpenRouter API key configured. Claude Code with `nano-banana-image` or `generate-image-open` skill installed. Video already uploaded (or scripted) so you know the hook.

---

### What You Say to the Agent

> "Generate 3 A/B YouTube thumbnail variants for my video about the Niyam Pattern. The video hook is 'Your AI agent breaks every time your CFO changes a policy — here's the fix.' Audience: D365 consultants and enterprise architects. I want one with my face (confident, pointing at text), one concept visual, and one before/after split. Use Formula 1 and Formula 2 from the YouTube thumbnail skill."

### What the Agent Does

**Variant A — Face + Hook (nano-banana-image):**
```
/nano-banana-image Professional headshot of a confident man in his 30s 
in a dark blazer, looking at camera with knowing expression, pointing right 
toward bold text. Bold white text reads "FIX YOUR AGENT". Navy blue gradient 
background with subtle blueprint lines. Dramatic studio lighting, cyan rim 
light. 1280x720, photorealistic YouTube thumbnail.
```
*Generated: Ragnar-likeness headshot, text renders cleanly, navy/cyan color scheme*

**Variant B — Concept Visual (nano-banana-image):**
```
/nano-banana-image Glowing Dataverse table with policy rows floating above 
a Copilot Studio agent interface, connected by golden light beams. 
Background: deep space purple. Bold white text at bottom: "POLICY-DRIVEN AGENTS". 
No people. Cinematic, high contrast, professional. 1280x720.
```
*Generated: Clean concept visual, immediately communicates the "data drives behavior" idea*

**Variant C — Before/After (ideogram via openrouter):**
*(Switches to Ideogram for better text rendering)*
```
Split screen YouTube thumbnail: Left half dark/red background shows broken 
robot icon with warning signs, text "BREAKS ON UPDATE". Right half bright 
green shows working robot with checkmark, text "STAYS CURRENT". Center divider 
with "VS". Clean, high contrast. 1280x720.
```
*Generated: Crystal clear text, immediately understandable comparison*

### The Business Impact

- **Variant A tested first** — 4.2% CTR after 48 hours (2.3x improvement)
- **Variant B** — 6.4% CTR after 48 hours (3.6x improvement, became the winner)
- **The concept visual beat the face thumbnail** for this technical audience — D365 consultants clicked the visual because it immediately communicated the pattern, not just the person
- **Video reached 12,000 views** in the first week vs the original thumbnail's projected 2,400

**Key learning:** For technical audiences (developers, architects, consultants), concept visuals often outperform face thumbnails because they immediately show "what will I learn?" rather than "who is this?"

### Try It Yourself

> "Now generate thumbnail variants for my next video: 'How I Saved 40 Hours a Week With One Copilot Studio Agent'. This video is more business-outcome focused. I want variants that emphasize the time savings number prominently — '40 HOURS' should be impossible to miss."
