# Product

<!-- impeccable:product-schema 1 -->

## Platform

web (mobile web first)

## Users
_Inferred 2026-09-23 after the user said the first draft needed revising everywhere: both audiences below are primary, neither is secondary._

- **Room creator:** someone in a friend group, club, MT/회식 crew, or couple who wants to see where everyone stands. Makes a room in under a minute, shares one link.
- **Participant:** opens the link on a phone, usually from KakaoTalk (in-app browser), answers 5-20 questions, then wants to see how the group split and who matched them.
- **Stranger (equally primary):** arrives from search, the /discover feed, or a shared public link, lands on a public room or a popular-question page ("탕수육 부먹 찍먹") and answers anonymously.

## Product Purpose
One link collects a named, finite group's answers to balance / multiple-choice / free-text questions, then compares them. Success is a room where everyone answered and someone forwards the result back into the chat.

## Positioning
Two pillars, equal weight:

- **Public balance-game feed:** real, open balance games anyone can answer in one tap and see the live split, with real aggregate counts.
- **Answer Lock:** in a private room you cannot see anyone's answer until you answered every question yourself (enforced at the API).
- **Group report:** because the group is named and finite, Deerlink can say "지우와 87% 일치", who the lone dissenter was, and which question split closest. Anonymous vote tools structurally cannot.
- Public rooms stay open one more day per new participant (cap 30 days). That is the sharing incentive.

## Operating Context
Korean. Entry points: group chats (KakaoTalk in-app browser), search (popular question pages), /discover, social shares, phones in hand at a bar, MT, club meeting, or couple's evening. Link previews (OG image) are the first touch.

## Capabilities and Constraints
- Question types: balance (A/B), multiple choice, subjective.
- Themes (question packs) and ~popular questions library seed room creation.
- Private rooms: 24h, nicknames. Public rooms: anonymous ("참여자 N"), no Answer Lock, no pair compatibility, listed on /discover.
- No accounts, no sign-up. No moderation UI yet.
- Answer once per participant; no unlimited re-voting mode.

## Brand Commitments
- Name Deerlink; antler = many branches meeting at one root. `AntlerLogo` mark.
- Light theme. Amber (deer fur) accent; balance option A is always amber, B always teal, on every screen.
- Pretendard Variable.
- No emoji, no mascot illustration, no fake product demos or fake friends, no em-dash in user-facing copy.

## Evidence on Hand
Real public rooms and real aggregated answer counts (`/popular/q/[id]`, only shown at 10+ answers). No testimonials, user counts, or press. Do not invent any.

## Product Principles
1. The group's answers are the content; show them, never decoration standing in for them.
2. Silence over fake precision: hide a stat when data is thin.
3. The first screen someone sees from a shared link must render on the server and say what to do.
4. Answering must feel fast: one tap per balance/multiple question.
5. Privacy of named groups beats growth: private rooms never become indexable.

## Accessibility & Inclusion
WCAG AA contrast (see CLAUDE.md floor), 44px tap targets, prefers-reduced-motion respected, iOS input zoom prevention kept.
