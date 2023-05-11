/*
 * Copyright (c) 2023 Marvin Witt
 * Licensed under the Open Software License version 3.0
 */

import { z } from "zod";

export type ReportTemplate = {
  name: string;
  description: string;
  tags: string[];
  ticketFormId: number;
  prefilledValues: Record<string, string>;
  fields: Record<
    string,
    {
      label: string;
      description: string;
      example: string;
      validation: z.ZodTypeAny;
    }
  >;
};

export const CustomFieldId = {
  MessageLink: 360008125792,
  TrustAndSafetyIssue: 360055270593,
  TrustAndSafetySpamWho: 360054260934,
  TrustAndSafetyAbuseWhat: 360055270753,
  TrustAndSafetyAbuseExplicitContentWhat: 360055309713,
  TrustAndSafetyAbuseExplicitContentCsamSpecifically: 360054298654,
  TrustAndSafetyAbuseExplicitContentCsamConfirm: 1500011227882,
};

export const dummyMessageLink =
  "https://discord.com/channels/000000000000000000/000000000000000000/000000000000000000";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

const baseReportTemplates: ReportTemplate[] = [
  {
    name: "Advertising via Profile Bio",
    description:
      "When a user is advertising via their profile bio, it's usually hard for Discord's Trust & Safety team to identify the exact issue when submitting a report.",
    tags: ["profile", "bio", "advertising"],
    ticketFormId: 360000029731,
    prefilledValues: {
      [CustomFieldId.MessageLink]: dummyMessageLink,
      [CustomFieldId.TrustAndSafetyIssue]:
        "__dc.ticket_form-tnsv1_report_spam__",
      [CustomFieldId.TrustAndSafetySpamWho]:
        "__dc.ticket_form-tnsv1_cat_-_spam__",

      subject: "Advertising via Profile Bio. User ID: {userId}",
      description: `Dear Discord Trust & Safety Team,

I would like to report a user for advertising via their profile bio. I'm unable to provide a message link as they are advertising via their profile bio field not via a message.

Their User ID is: {userId}
The infringing content is in their profile bio.

Thank you for your time. 

Kind regards,
{name}`,
    },
    fields: {
      userId: {
        label: "User ID",
        description: "The user's ID",
        example: "123456789012345678",
        validation: z.string().regex(/^\d{17,18}$/, "Must be a valid user ID"),
      },
      name: {
        label: "Your Name",
        description: "Can be your Discord username or real name",
        example: "John Doe",
        validation: z.string().nonempty(),
      },
    },
  },
  {
    name: "CSAM Attachment",
    description:
      "Sometimes external pages are using Discord's CDN to host CSAM.",
    tags: ["CSAM", "attachment", "child sexual abuse material", "child porn"],
    ticketFormId: 360000029731,
    prefilledValues: {
      [CustomFieldId.MessageLink]: dummyMessageLink,
      [CustomFieldId.TrustAndSafetyIssue]:
        "__dc.ticket_form-tnsv1_report_abuse_or_harassment__",
      [CustomFieldId.TrustAndSafetyAbuseWhat]:
        "__dc.ticket_form-tnsv1_cat_-_explicit_or_sexual_content__",
      [CustomFieldId.TrustAndSafetyAbuseExplicitContentWhat]:
        "__dc.ticket_form-tnsv1_subcat_-_scrm__",
      [CustomFieldId.TrustAndSafetyAbuseExplicitContentCsamSpecifically]:
        "__dc.ticket_form-tnsv1_subsubcat_-_csam__",
      [CustomFieldId.TrustAndSafetyAbuseExplicitContentCsamConfirm]: "on",

      subject: "CSAM in Message Attachment",
      description: `Dear Discord Trust & Safety Team,

An external page is using Discord's CDN to host CSAM. I'm unable to provide a message link as the website is only using Discord's CDN to host the CSAM.

The URL of the attachment is: {attachmentUrl}

Thank you for your time.

Kind regards,
{name}`,
    },
    fields: {
      attachmentUrl: {
        label: "Attachment URL",
        description: "The URL of the attachment",
        example: "https://cdn.discordapp.com/attachments/...",
        validation: z
          .string()
          .regex(
            /^https:\/\/cdn\.discordapp\.com\/attachments\/\d{17,20}\/\d{17,20}\/.+$/,
            "Must be a valid attachment URL"
          ),
      },
      name: {
        label: "Your Name",
        description: "Can be your Discord username or real name",
        example: "John Doe",
        validation: z.string().nonempty(),
      },
    },
  },
];

export const reportTemplates = baseReportTemplates.map((option) => ({
  ...option,
  slug: slugify(option.name),
}));
