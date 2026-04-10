---
name: outlook-newsletter
description: Create and manage newsletters in Microsoft Outlook — setup, edition drafting, subscriber management, visibility settings, and analytics. Use when user says 'create a newsletter in Outlook', 'Outlook newsletter', 'newsletter edition', 'newsletter subscribers', 'publish a newsletter', 'Microsoft newsletter'.
version: 1.0.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [beginner, content, outlook, newsletter, microsoft-365]
requires: Microsoft 365, Outlook with Newsletters feature
---

# Outlook Newsletter

Create and manage newsletters directly in Microsoft Outlook. Distribute editions to subscribers inside or outside your organization, track engagement, and build a recurring content channel without leaving M365.

## Triggers

- "create a newsletter in Outlook"
- "Outlook newsletter"
- "publish a newsletter edition"
- "manage newsletter subscribers"
- "newsletter in Microsoft 365"
- "how do I send a newsletter in Outlook"

## How It Works

### Step 1: Create the Newsletter

1. Open Outlook and select **Newsletters** in the navigation bar
2. From the **Home** tab, choose **Create newsletter**
3. Enter a **title** (appears in every edition header and in search results) and optional description
4. Add **co-owners** if needed — up to 100, each with full admin permissions including analytics and subscriber export
5. Set **visibility**:
   - **My organization** — discoverable by anyone in your org
   - **Unlisted** — accessible only via direct link
   - **Private** — invited users only (subscriptions disabled)
6. Add a **header image** (704px wide, 16:9 ratio) and logo
7. Configure **default subscription**: toggle on if you want users auto-subscribed, off for opt-in only
8. Click **Save**

### Step 2: Draft an Edition

1. From your newsletter home, click **New edition**
2. Add subject line, body content, images, and links using the rich editor
3. Preview on desktop and mobile before sending
4. Save as draft to continue later

### Step 3: Set Visibility and Send

1. Choose the audience: all subscribers, a segment, or test send to yourself
2. Schedule for later or send immediately
3. Outlook delivers via email and surfaces in the Newsletters hub

### Step 4: Monitor Performance

- Open **Analytics** from the newsletter dashboard
- Track open rate, click rate, subscriber growth, and unsubscribes per edition
- Export subscriber list via the co-owner panel

## Subscriber Management

| Action | Where |
|--------|-------|
| View subscribers | Newsletter settings > Subscribers |
| Export list | Newsletter settings > Export |
| Add/remove manually | Newsletter settings > Manage subscribers |
| Auto-subscribe org | Toggle in creation settings |
| Unsubscribe | Subscriber clicks unsubscribe link in any edition |

## Header Image Spec

- Width: 704px
- Aspect ratio: 16:9
- Formats: JPG, PNG
- Recommended: create in Canva or use the image-prompt-generator skill to generate one

## Checklist

- [ ] Newsletter created with clear title and description
- [ ] Visibility set correctly (org / unlisted / private)
- [ ] Header image uploaded (704px, 16:9)
- [ ] Co-owners added if needed
- [ ] First edition drafted and previewed
- [ ] Test send reviewed before publishing
- [ ] Analytics checked after first send

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Newsletters option not visible in Outlook | Feature not enabled for your tenant | Contact your M365 admin to enable the Newsletters app |
| Header image looks cropped | Wrong dimensions | Resize to exactly 704px wide at 16:9 ratio before uploading |
| Subscribers not receiving editions | Auto-subscribe was off at creation | Manually add subscribers or share the newsletter link for opt-in |
| Can't access analytics | Not a co-owner | Ask the newsletter creator to add you as a co-owner |
| Private newsletter shows no subscribe button | Expected behavior | Private newsletters are invite-only, subscriptions are disabled |

## Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-10 | Initial skill |
